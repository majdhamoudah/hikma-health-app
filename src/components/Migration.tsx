import React, { useState } from 'react';
import {
  View,,Input, TouchableOpacity, Button
} from 'react-native';

import { database } from "../storage/Database";
import { v4 as uuid } from 'uuid';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import Header from './shared/Header';

export const MigrationDisplay = (metadataObj) => {
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
      <Text style={{ width: '50%' }}>Weight: {metadataObj.weight} kg</Text>
      <Text style={{ width: '50%' }}>BG: {metadataObj.bloodGlucose}</Text>
    </View>)
}

const Migration = (props) => {
  const [travelingAlone, setTravelingAlone] = useState(null);
  const [travelingAloneAge, setTravelingAloneAge] = useState(null);
  const [familyTravelNumber, setFamilyTravelNumber] = useState(null);
  const [whoAreChildrenTravelingWith, setWhoAreChildrenTravelingWith] = useState(null);
  const [dateOfArrivalToTheUs,setDateOfArrivalToTheUs] = useState(null);
  const [countryOfBirth, setCountryOfBirth] = useState(null);
  const [countryOfResidenceBeforeTheUs, setCountryOfResidenceBeforeTheUs] = useState(null);
  const [timeInCountryOfResidence, setTimeInCountryOfResidence] = useState(null);
  const [otherDOTWChapters, setOtherDOTWChapters] = useState(null);
  const [timeSpentInJuarez, setTimeSpentInJuarez] = useState(null);
  const [servicesReceivedInJuarez, setServicesReceivedInJuarez] = useState(null);
  const [reasonsForMigratingToTheUs, setReasonsForMigratingToTheUs] = useState(null);
  const [countriesVisitedBeforeTheUs, setCountriesVisitedBeforeTheUs] = useState(null);
  const [darienGap, setDarienGap] = useState(null);
  const [trauma, setTrauma] = useState(null);
  const [finalDestinationInTheUs, setFinalDestinationInTheUs] = useState(null);
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));

  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');

  const setMigration = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: EventTypes.Migration,
      event_metadata: JSON.stringify({
        travelingAlone,
        travelingAloneAge,
        familyTravelNumber,
        whoAreChildrenTravelingWith,
        dateOfArrivalToTheUs,
        countryOfBirth,
        countryOfResidenceBeforeTheUs,
        timeInCountryOfResidence,
        otherDOTWChapters,
        timeSpentInJuarez,
        servicesReceivedInJuarez,
        reasonsForMigratingToTheUs,
        countriesVisitedBeforeTheUs,
        darienGap,
        trauma,
        finalDestinationInTheUs
      })
    }).then(() => {
      props.navigation.navigate('NewVisit')
    })
  };

  return (
    <View style={styles.container}>
      {Header({ action: () => props.navigation.navigate('NewVisit', { language }), language, setLanguage })}
      <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].vitals}</Text>
      <View style={[styles.inputRow, { marginTop: 30 }]}>
        <TextInput
          style={styles.inputs}
          placeholder="HR"
          onChangeText={(text) => setHeartRate(text)}
          value={heartRate}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>BPM</Text>
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
          onPress={() => setMigration()} />
      </View>
    </View>
  );
};

export default Migration;
