import React, { useState } from 'react';
import {
  View,Input, TouchableOpacity, Button
} from 'react-native';

import { database } from "../storage/Database";
import { v4 as uuid } from 'uuid';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import Header from './shared/Header';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const SociodemographicDisplay = (metadataObj) => {
  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}>
      <Text style={{ width: '50%' }}>Martial Status: {metadataObj.maritalStatus}</Text>
      <Text style={{ width: '50%' }}>Language Spoken: {metadataObj.languageSpoken}</Text>
      <Text style={{ width: '50%' }}>Education: {metadataObj.education}%</Text>
      <Text style={{ width: '50%' }}>Highest Education Level: {metadataObj.highestEducationLvl} °C</Text>
      <Text style={{ width: '50%' }}>Occupation: {metadataObj.occupation}</Text>
    </View>)
}

const Sociodemographic = (props) => {
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [languageSpoken, setLanguageSpoken] = useState(null);
  const [education, setEducation] = useState(null);
  const [highestEducationLvl, setHighestEducationLvl] = useState(null);
  const [occupation, setOccupation] = useState(null);
  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');

  const setSociodemographic = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: EventTypes.Sociodemographic,
      event_metadata: JSON.stringify({
        maritalStatus,
        languageSpoken,
        education,
        highestEducationLvl,
        occupation
      })
    }).then(() => {
      props.navigation.navigate('NewVisit')
    })
  };

  const handleChangeInMaritalStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaritalStatus((event.target as HTMLInputElement).value);
  };
  const handleChangeInLanguageSpoken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguageSpoken((event.target as HTMLInputElement).value);
  };
  const handleChangeInEducation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEducation((event.target as HTMLInputElement).value);
  };
  const handleChangeInHighestEducationLvl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHighestEducationLvl((event.target as HTMLInputElement).value);
  };
  const handleChangeInOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOccupation((event.target as HTMLInputElement).value);
  };

  return (
    <View style={styles.container}>
      {Header({ action: () => props.navigation.navigate('NewVisit', { language }), language, setLanguage })}
      <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{Sociodemographic}</Text>
      <View style={[styles.inputRow, { marginTop: 30 }]}>
        <FormControl>
          <FormLabel id="maritalStatus">Martial Status</FormLabel>
            <RadioGroup
              aria-labelledby="Martial-Status"
              name="Martial-Status"
              value={maritalStatus}
              onChange={handleChangeInMaritalStatus}
            >
              <FormControlLabel value="Single" control={<Radio />} label="Single" />
              <FormControlLabel value="Partnered" control={<Radio />} label="Partnered (not civil marriage)" />
              <FormControlLabel value="Married" control={<Radio />} label="Married" />
              <FormControlLabel value="Divorced" control={<Radio />} label="Divorced" />
              <FormControlLabel value="Widowed" control={<Radio />} label="Widowed" />
              <FormControlLabel value="" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Systolic"
          onChangeText={(text) => setSystolic(text)}
          value={systolic}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>/</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Diastolic"
          onChangeText={(text) => setDiastolic(text)}
          value={diastolic}
          keyboardType='numeric'
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Sats"
          onChangeText={(text) => setSats(text)}
          value={sats}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>%</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Temp"
          onChangeText={(text) => setTemp(text)}
          value={temp}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>°C</Text>
        <TextInput
          style={styles.inputs}
          placeholder="RR"
          onChangeText={(text) => setRespiratoryRate(text)}
          value={respiratoryRate}
          keyboardType='numeric'
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Weight"
          onChangeText={(text) => setWeight(text)}
          value={weight}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>kg</Text>
        <TextInput
          style={styles.inputs}
          placeholder="BG"
          onChangeText={(text) => setBloodGlucose(text)}
          value={bloodGlucose}
          keyboardType='numeric'
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Button
          title={LocalizedStrings[language].save}
          color={'#F77824'}
          onPress={() => setSociodemographic()} />
      </View>
    </View>
  );
};

export default Sociodemographic;
