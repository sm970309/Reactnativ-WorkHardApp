import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TextInput, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EvilIcons } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(() =>{loadState});
  const travel = async () => {
    await saveState(false);
    setWorking(false);
  }
  const work = async () => {
    await saveState(true);
    setWorking(true);
  }
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(true);

  const saveState = async(toSave) =>{
    await AsyncStorage.setItem('state',JSON.stringify(toSave))
  }
  const loadState = async() =>{
    const s = await AsyncStorage.getItem('state')
    setWorking(JSON.parse(s))
  }
  const onChangeText = (event) => {
    setText(event)
  }
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }
  
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDos(JSON.parse(s));
    setLoading(false)
  }
  useEffect(() => {
    loadToDos();
    loadState();
  }, [])
  const addToDo = async () => {
    if (text === "") {
      return
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working }
    }
    setToDos(newToDos);
    await saveToDos(newToDos)
    setText("");
  }
  const deleteToDo = async (key) =>{
    Alert.alert("Delete To Do", "Are you sure?",[
      {text:"Cancel"},
      {text:"Sure",onPress:async ()=>{
        const newToDos = {...toDos};
        delete newToDos[key]
        setToDos(newToDos);
        await saveToDos(newToDos);
        },
      }
    ])
    return;
    
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableHighlight onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}>Work</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? 'white' : theme.grey }}>Travel</Text>
        </TouchableHighlight>
      </View>
      <View>
        <TextInput
          value={text}
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          placeholder={working ? "Add a To Do" : "Where do you wanna go?"}
          style={styles.input} />
      </View>
      {loading ? (
        <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
          <ActivityIndicator color="white" size="large" />
        </View>
      ) :
        (<ScrollView style={{ marginTop: 30 }}>{
          Object.keys(toDos).map(key =>
            toDos[key].working === working ? (
              <View style={{ ...styles.toDos }} key={key}>
                <Text style={styles.txt}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={()=>deleteToDo(key)}>
                <EvilIcons name="trash" size={24} color='white' />
                </TouchableOpacity>
              </View>) : null)
        }
        </ScrollView>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18
  },
  toDos: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  txt: {
    fontSize: 16,
    color: 'white',
  }
});
