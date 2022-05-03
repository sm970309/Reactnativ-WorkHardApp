import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TextInput, ScrollView} from 'react-native';
import { useState } from 'react';
import { theme } from './color';

export default function App() {
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const [text,setText] = useState('');
  const [toDos,setToDos] = useState({});
  
  
  const onChangeText = (event) =>{
    setText(event)

  }
  const addToDo = () =>{
    if (text===""){
      return
    }
    const newToDos = {...toDos,
      [Date.now()]:{text,working}
    }
    setToDos(newToDos);
    setText("");    
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}>Work</Text>
        </TouchableOpacity>
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
      <ScrollView style={{ marginTop:30}}>{
       Object.keys(toDos).map(key=>
       toDos[key].working ===working ? (
       <View style={{...styles.toDos}} key={key}>
         <Text style={styles.txt}>{toDos[key].text}</Text>
       </View>) :null)
      }
      </ScrollView>
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
  toDos:{
    backgroundColor:theme.toDoBg,
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius:15
  },
  txt:{
    fontSize:16,
    color:'white',
    
  }
});
