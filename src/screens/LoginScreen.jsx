import {
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useState } from "react";
  //   import { Context } from '../provider/AppProvider';
  import axios from "axios";
  import SizedBox from "../components/SizedBox";
import { ActivityIndicator } from "react-native-paper";
  
  export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
  
    const handleLogin = () => {
      axios
        .post("https://statotestapi.azurewebsites.net/Accounts/authenticate", {
          email: email,
          password: password,
        })
        .then((response) => {
          alert(response.data.jwtToken);
        })
        .catch((error) => {
          alert(error.message);
        });
        setIsActive(false);
    };
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {isActive &&
        <View style={{...StyleSheet.absoluteFill, justifyContent: 'center',
        alignItems: 'center', zIndex: 10}}>
            <ActivityIndicator color="#8b0000" style={styles.loadingcircle}/>
            </View>
  }

        <View style={styles.logoView}>
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        </View>
        <SizedBox height={70} />
        <SafeAreaView style={styles.container}>
          <View style={styles.welcomeView}>
            <Text style={styles.title}>Welcome back!</Text>
            <SizedBox height={8} />
            <Text style={styles.subtitle}>Log in to your account</Text>
            <SizedBox height={25} />
          </View>
  
          <Pressable>
            <View style={styles.form}>
              <TextInput
                autoCapitalize="none"
                autoCompleteType="email"
                onChangeText={(text) => setEmail(text)}
                placeholder="Email"
                placeholderTextColor={"rgba(235, 235, 245, 0.6)"}
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="username"
              />
            </View>
          </Pressable>
  
          <SizedBox height={16} />
  
          <Pressable>
            <View style={styles.form}>
              <TextInput
                autoCapitalize="none"
                autoCompleteType="password"
                onChangeText={(text) => setPassword(text)}
                placeholder="Password"
                placeholderTextColor={"rgba(235, 235, 245, 0.6)"}
                autoCorrect={false}
                returnKeyType="done"
                secureTextEntry
                style={styles.textInput}
                textContentType="password"
              />
            </View>
          </Pressable>
  
          <SizedBox height={30} />
  
          <Pressable onPress={() => [setIsActive(true), handleLogin() ]} disabled={isActive}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>Login</Text>
            </View>
          </Pressable>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#8B0000',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
      },
      buttonTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 22,
      },
      content: {
        flex: 1,
        backgroundColor: '#262625',
        justifyContent: "flex-start",
        paddingHorizontal: 16,
        paddingTop: 30,
      },
      forgotPasswordContainer: {
        alignItems: 'flex-end',
      },
      form: {
        alignItems: 'center',
        backgroundColor: 'rgb(58, 58, 60)',
        borderRadius: 8,
        flexDirection: 'row',
        height: 48,
        paddingHorizontal: 16,
      },
      label: {
        color: 'rgba(235, 235, 245, 0.6)',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 20,
        width: 80,
      },
      container: {
        flex: 1,
        backgroundColor: '#262625',
        justifyContent: "flex-start",
        
      },
      subtitle: {
        color: 'rgba(235, 235, 245, 0.6)',
        fontSize: 17,
        fontWeight: '400',
        lineHeight: 22,
        fontFamily: "Poppins-Regular"
      },
      textButton: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 20,
      },
      textInput: {
        color: '#FFFFFF',
        flex: 1,
        fontSize: 16,
      },
      title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 34,
        fontFamily: "Poppins-SemiBold"
      },
      welcomeView: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo:{
        width: 120,
        height: 50,
      },
      logoView:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
      },
      
  });
  