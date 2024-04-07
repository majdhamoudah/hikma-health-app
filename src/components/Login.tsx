import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Picker, Modal, TouchableHighlight, ScrollView
} from 'react-native';

import { database } from "../storage/Database";
import { StringContent } from '../types/StringContent';
import { NewUser } from '../types/User';
import { DatabaseSync } from '../storage/Sync'
import { Clinic } from '../types/Clinic';
import styles from './Style';

const Login = (props) => {
  const databaseSync = new DatabaseSync();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instanceList, setInstanceList] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState({"name": "DOTW", "url": "https://dotw-hikma.azurewebsites.net"});
  const [showInstanceDropdown, setShowInstanceDropdown] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [syncModalVisible, setSyncModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  let userId = '';
  let clinicId = '';
  let instanceUrl = '';

  useEffect(() => {
    database.usersExist().then(result => {
      if (!result) {
        getInstances().then(response => {
          setInstanceList(response)
        })
        setShowInstanceDropdown(true)
      } else {
        setShowInstanceDropdown(false)
      }
      database.close()
    })
  }, [props])

  const getInstances = async (): Promise<any> => {
    return fetch('https://dotw-hikma.azurewebsites.net/api/instances', {
      method: 'GET',
    }).then(response => {
      return response.json()
    })
  }

  const remoteLogin = async (): Promise<any> => {
    const response = await fetch(`${selectedInstance.url}/api/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      })
    });
    console.log(response);
    if (!response.ok) {
        console.log('issue with login!');
    } else {
        console.log('Login is a success');
        return response.json();
    }
  }

  const handleLogin = async () => {

    const user = await database.login(email, password)

    if (user === null || user === undefined) {
      console.log("email: " + email)
      console.log("password: " + password)

      if (selectedInstance === null || selectedInstance === undefined) {
        setLoginFailed(true);
        setErrorMsg('Incorrect credentials');
        return;
      }

      const responseJson = await remoteLogin();

      console.log('response ' + responseJson)

      if (!!responseJson.message) {
        setLoginFailed(true);
        setErrorMsg(responseJson.message);
        return;
      }

   
      const contentArray = Object.keys(responseJson.name)
      const stringContentArray: StringContent[] = []
      contentArray.forEach(element => {
        stringContentArray.push({
          language: element,
          content: responseJson.name[element]
        })
      })

      const nameId = await database.saveStringContent(stringContentArray, responseJson.name.id)
      const newUser: NewUser = {
        id: responseJson.id,
        name: nameId,
        role: responseJson.role,
        email: responseJson.email,
        instance_url: selectedInstance.url
      }
      userId = responseJson.id.replace(/-/g, "");
      instanceUrl = selectedInstance.url
      await database.addUser(newUser, password)
    } else {
      userId = user.id
      instanceUrl = user.instance_url
    }
    console.log("here4");
    const clinics: Clinic[] = await database.getClinics();
    console.log("her3, " + clinics.length);
    if (clinics.length == 0) {
      setSyncModalVisible(true)
      console.log("here");
      await databaseSync.performSync(instanceUrl, email, password, 'en')
      console.log("here1");
      const clinicsResponse: Clinic[] = await database.getClinics()
      console.log("here2");
      
      setSyncModalVisible(false)
      clinicId = clinicsResponse[0].id
    } else {
      console.log("here 5");
      setSyncModalVisible(false)
      clinicId = clinics[0].id
    }
    props.navigation.navigate('PatientList', {
      email: email,
      password: password,
      reloadPatientsToggle: false,
      clinicId: clinicId,
      userId: userId,
      instanceUrl,
    })

  };

  return (
    <View style={styles.loginContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={syncModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Initial sync in progress - please wait</Text>
          </View>
        </View>
      </Modal>

      <View >
        <Image source={require('../images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.loginInputsContainer}>
        <TextInput
          style={loginFailed ? styles.loginInputsFailed : styles.loginInputs}
          placeholder="Email"
          onChangeText={(text) => {
            setEmail(text);
            setLoginFailed(false);
          }}
          value={email}
        />
        <TextInput
          style={loginFailed ? styles.loginInputsFailed : styles.loginInputs}
          placeholder="Password"
          onChangeText={(text) => {
            setPassword(text);
            setLoginFailed(false);
          }}
          value={password}
          secureTextEntry={true}
        />
        {loginFailed ? <Text style={{ color: '#FF0000', fontSize: 10, paddingLeft: 10 }}>Login Error: {errorMsg}</Text> : null}
      </View>

      <View>
        <TouchableOpacity onPress={handleLogin}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
          <Image source={require('../images/information.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
