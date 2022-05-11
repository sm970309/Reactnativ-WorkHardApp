import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TextInput, ScrollView, Alert} from 'react-native';
import { useState, useEffect ,useRef} from 'react';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EvilIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 


const STORAGE_KEY = "@toDos";

export default function App() {
  const checked = false;
  const [working, setWorking] = useState(() =>{loadState});
  const modify = false;
  const [text, setText] = useState('');
  const [new_text,setNewText] = useState('');
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(true);

  const travel = async () => {
    await saveState(false);
    setWorking(false);
  }
  const work = async () => {
    await saveState(true);
    setWorking(true);
  }
  

  const changeChecked = async (key) =>{
    const newchecked = toDos[key].checked? false:true
    const newworking = toDos[key].working
    const newtext = toDos[key].text
    const newmodify = toDos[key].modify
    const newToDos = {...toDos}
    newToDos[key]={checked:newchecked,working:newworking,text:newtext,modify:newmodify};
    setToDos(newToDos);
    await saveToDos(newToDos);
  }
  const modifyToDo = async (key) =>{
    const newmodify = toDos[key].modify? false:true
    const newworking = toDos[key].working
    const newtext = toDos[key].text
    const newchecked = toDos[key].checked
    const newToDos = {...toDos}
    newToDos[key]={checked:newchecked,working:newworking,text:newtext,modify:newmodify};
    setToDos(newToDos);
    await saveToDos(newToDos);
  }
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
  const onChangeNewText = (new_text,old_text) =>{
    if (new_text.trim()==''){
      setNewText(old_text)
    }
    else{
      setNewText(new_text)
    }
  }
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }
  
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    if (s!==null){
      setToDos(JSON.parse(s));
    }
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
      [Date.now()]: { text, working, checked, modify }
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
  const changeText = async(key) =>{
    const newmodify = toDos[key].modify?false:true
    const newworking = toDos[key].working
    const newtext = new_text
    const newchecked = toDos[key].checked
    const newToDos = {...toDos}
    newToDos[key]={checked:newchecked,working:newworking,text:newtext,modify:newmodify};
    setToDos(newToDos);
    await saveToDos(newToDos);
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
          style={styles.input} 
          blurOnSubmit={false}
          />
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
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>changeChecked(key)}>
                  {!toDos[key].checked ? 
                  <View style={{flexDirection:'row'}}>
                    <Feather name="square" size={24} color="white" style={{marginRight:10}}/>
                    {!toDos[key].modify?
                    <Text style={styles.txt}>{toDos[key].text}</Text>:
                    <TextInput
                      onFocus={() => setNewText(toDos[key].text)}
                      onChangeText={(text) =>onChangeNewText(text,toDos[key].text)}
                      style={{color:'white'}}
                      placeholder='Click here and modify'
                      placeholderTextColor={theme.grey}
                      onSubmitEditing={() => changeText(key)} 
                      autoFocus={true}
                      onBlur={()=>changeText(key)}
                    />}
                  </View>
                  :<View style={{flexDirection:'row'}}>
                    <Feather name="check-square" size={24} color="white" style={{marginRight:10 }}/>
                    {!toDos[key].modify?
                    <Text style={styles.txt_checked}>{toDos[key].text}</Text>:
                    <TextInput
                      onFocus={() => setNewText(toDos[key].text)}
                      onChangeText={(text) =>onChangeNewText(text,toDos[key].text)}
                      style={{color:'white'}}
                      placeholder='Click here and modify'
                      placeholderTextColor={theme.grey}
                      onSubmitEditing={() =>changeText(key)} 
                      autoFocus={true}
                      onBlur={()=>changeText(key)}
                    />}
                </View>}
                </TouchableOpacity>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={{marginRight:20}}onPress={() => modifyToDo(key)}>
                <Feather name="tool" size={18} color='white' />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={()=>deleteToDo(key)}>
                <EvilIcons name="trash" size={24} color='white' />
                </TouchableOpacity>
                </View>
                
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
  },
  txt_checked: {
    fontSize: 16,
    color: 'white',
    textDecorationLine:'line-through'
  }
});
