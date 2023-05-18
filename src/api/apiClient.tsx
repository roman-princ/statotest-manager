import axios from 'axios';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationError from '../components/notificationErr';
import notificationSuccess from '../components/notificationSuccess';
import Geolocation from '@react-native-community/geolocation';

interface IApiClient {
  fetchCompanies: () => Promise<void>;
  fetchConstructions: (compId: String) => void;
  fetchMPs: (compId: String, consId: String) => Promise<void>;
  fetchDevice: (compId: String, consId: String, mpId: String) => Promise<void>;
  handleEditDesc: (compId: String, mpId: String, desc: String) => Promise<void>;
  handleLogin: (email: String, password: String) => Promise<boolean>;
  setLocation: (compId: String, mpId: String) => void;
  companies: any;
  constructions: any;
  MPs: any;
  device: any;
  isActive: boolean;
}

const apiClientContext = (): IApiClient => {
  const API_URL = 'https://statotestapiv3.azurewebsites.net/';
  const [companies, setCompanies] = useState([]);
  const [constructions, setConstructions] = useState([]);
  const [MPs, setMP] = useState([]);
  const [device, setDevice] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const handleLogin = async (
    email: String,
    password: String,
  ): Promise<boolean> => {
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    Keyboard.dismiss();
    setIsActive(true);

    try {
      const response = await axios.post(API_URL + 'Accounts/authenticate', {
        email: email,
        password: password,
      });

      const token = JSON.stringify(response.data.jwtToken);
      await AsyncStorage.setItem('token', token);
      setIsActive(false);
      return true;
    } catch (error) {
      notificationError("Email or password doesn't match");
      setIsActive(false);
      return false;
    }
  };

  const fetchCompanies = async () => {
    setIsActive(true);
    await AsyncStorage.getItem('token').then(async token => {
      await axios
        .post(
          API_URL + 'Company/Get',
          {},
          {
            headers: {
              Authorization: String(token).replace(/['"]+/g, ''),
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          setCompanies(response.data);
        })
        .catch(error => {
          notificationError(error.message);
        });
      setIsActive(false);
      trigger('notificationSuccess', {
        ignoreAndroidSystemSettings: false,
        enableVibrateFallback: true,
      });
    });
  };

  const fetchConstructions = async (compId: String) => {
    setIsActive(true);
    await AsyncStorage.getItem('token').then(async token => {
      await axios
        .post(
          API_URL + 'Constructions/get',
          {
            compId: compId,
          },
          {
            headers: {
              Authorization: String(token).replace(/['"]+/g, ''),
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          setConstructions(response.data);
        })
        .catch(error => {
          notificationError(error.message);
        });
      trigger('notificationSuccess', {
        ignoreAndroidSystemSettings: false,
        enableVibrateFallback: true,
      });
    });
    setIsActive(false);
  };
  //Get MPs
  const fetchMPs = async (compId: String, consId: String) => {
    setIsActive(true);
    await AsyncStorage.getItem('token').then(async token => {
      await axios
        .post(
          API_URL + 'MP/Get',
          {
            compId: compId,
            consId: consId,
          },
          {
            headers: {
              Authorization: String(token).replace(/['"]+/g, ''),
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          setMP(response.data);
        })
        .catch(error => {
          notificationError(error.message);
        });
      setIsActive(false);
      trigger('notificationSuccess', {
        ignoreAndroidSystemSettings: false,
        enableVibrateFallback: true,
      });
    });
  };
  //Get device
  const fetchDevice = async (compId: String, consId: String, mpId: String) => {
    await AsyncStorage.getItem('token').then(async token => {
      await axios
        .post(
          API_URL + 'MP/dev/get',
          {
            compId: compId,
            consId: consId,
            mpId: mpId,
          },
          {
            headers: {
              Authorization: String(token).replace(/['"]+/g, ''),
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          axios
            .post(
              API_URL + 'Device/Get',
              {
                devId: response.data[0].devId,
              },
              {
                headers: {
                  Authorization: String(token).replace(/['"]+/g, ''),
                  'Content-Type': 'application/json',
                },
              },
            )
            .then(response => {
              setDevice(response.data);
            })
            .catch(error => {
              notificationError(error.message);
            });
        })
        .catch(error => {
          //notificationError(error.message);
        });
      trigger('notificationSuccess', {
        ignoreAndroidSystemSettings: false,
        enableVibrateFallback: true,
      });
    });
  };

  const handleEditDesc = async (compId: String, mpId: String, desc: String) => {
    setIsActive(true);
    await AsyncStorage.getItem('token').then(token => {
      axios
        .post(
          API_URL + 'MP/Upd',
          {
            compId: compId,
            mpId: mpId,
            mpDesc: desc,
          },
          {
            headers: {
              Authorization: String(token).replace(/['"]+/g, ''),
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => {
          notificationSuccess('Description updated to ' + desc);
        })
        .catch(error => {
          trigger('notificationError', {
            ignoreAndroidSystemSettings: false,
            enableVibrateFallback: true,
          });
          notificationError(error.message);
        });
    });
    setIsActive(false);
  };

  const setLocation = async (compId: String, mpId: String) => {
    Geolocation.getCurrentPosition(info => {
      setIsActive(true);
      AsyncStorage.getItem('token').then(token => {
        axios
          .post(
            API_URL + 'MP/Upd',
            {
              compId: compId,
              mpId: mpId,
              mpLat: info.coords.latitude,
              mpLong: info.coords.longitude,
            },
            {
              headers: {
                Authorization: String(token).replace(/['"]+/g, ''),
                'Content-Type': 'application/json',
              },
            },
          )
          .then(() => {
            notificationSuccess('Location updated');
          })
          .catch(error => {
            trigger('notificationError', {
              ignoreAndroidSystemSettings: false,
              enableVibrateFallback: true,
            });
            notificationError(error.message);
          });
      });
      setIsActive(false);
    });
  };

  return {
    handleLogin,
    handleEditDesc,
    fetchCompanies,
    fetchConstructions,
    fetchMPs,
    fetchDevice,
    companies,
    constructions,
    MPs,
    device,
    isActive,
    setLocation,
  };
};

export default apiClientContext;
