import React, {useEffect, useState} from 'react'
import { LogBox, StyleSheet, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import {Picker} from '@react-native-picker/picker';


const statisticalScreen = () => {

const [listOrder,setListOrder] = useState([]);
const [selectedColor, setSelectedColor] = useState(month);
//var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const d = new Date();
let month = d.getMonth() +1;
let thisMon = ''+d.getFullYear()+'-'+ d.getMonth()+1;
console.log("Năm tháng: ",thisMon);

 const getYYDD = (data)=> {
    const event = new Date(data);
    //console.log(event.toString());
    console.log("convert IOS",event.toISOString().slice(0,7));
    return event.toISOString().slice(0,7)
 }


let thisMonth =()=> {
    let Month = [];
    
    for(let i = 0; i < listOrder.length; i++)
    {
        //console.log("Test convert:",listOrder[i].dateTime.toDate().toLocaleDateString('en-GB').replace( /(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
        if(getYYDD(listOrder[i].dateTime.toDate().toISOString()) == thisMon)
        {
            console.log("Data:",getYYDD(listOrder[i].dateTime.toDate().toISOString())); 
            Month.push(listOrder[i]);
        }
    }
    return Month;
}

// const formatYmd =(date) => {
//     console.log('convert: ',date+'');
//     //date.toISOString().slice(0, 10);
// }

// for(let i = 0; i < listOrder.length; i++)
//     {

//         console.log("Test convert:",formatYmd(listOrder[i].dateTime.toDate().toString()));

//     }

let data = thisMonth();
console.log("Đơn trong tháng:",data);

useEffect(async () => {
    const subscriber = await firestore()
      .collection('Orders')
      .onSnapshot(querySnapshot => {
        const order = [];

        querySnapshot.forEach(documentSnapshot => {
            order.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        //setIsLoading(false);
        setListOrder(order);
      });
    LogBox.ignoreLogs([
      "Can't perform a React state update on an unmounted component.",
    ]);
    return () => subscriber();
  }, []);


    const listMonth = [];
    for (let i = 1; i <= d.getMonth()+1; i++) {
        console.log("tháng:",i);
        listMonth.push(<Picker.Item key={i} value={i} label={i.toString()} />);}

    return (
        <View style={{flex:1}}>
            <View style={{flex:1.2}}>
                <View style={{width: '80%', justifyContent:'center', alignItems:'center', marginLeft:'10%',height: 40,marginTop:10, borderColor:'#fff', backgroundColor:'#fff',borderWidth: 0.5, borderRadius: 10, shadowColor:'black', elevation: 5 }}>
                    <Text style={{fontSize: 18, marginBottom: 10, marginTop: 5}}>Trong ngày</Text>
                </View>

                <View style={{width: '100%', flexDirection:'row', justifyContent:'space-around', marginTop: 10}}>
                    <LinearGradient colors={['#ffff', 'yellow', '#fff']} style={{width: '40%',height: 100,justifyContent:'center', alignItems:'center', borderRadius: 10}}>
                        <Text style={{fontSize: 30}}>15</Text>
                        <Text style={{fontSize: 15}}>Đơn hàng</Text>
                    </LinearGradient>

                    <LinearGradient colors={['red', 'white', 'green']} style={{width: '40%', height: 100,justifyContent:'center', alignItems:'center', borderRadius: 10}}>
                        <Text style={{fontSize: 18, marginTop: 15}}>14.000.000 VNĐ</Text>
                        <Text style={{fontSize: 15, marginTop: 5}}>Tổng tiền</Text>
                    </LinearGradient>

                </View>

            </View>
            <View style={{flex:2,}}>
                <View style={{width: '80%', justifyContent:'center', alignItems:'center', backgroundColor:'#fff',marginLeft:'10%', borderWidth: 0.5, borderColor:'#fff',borderRadius: 10, shadowColor:'black', elevation: 5}}>
                    <Text style={{fontSize: 18, marginBottom: 10, marginTop: 5}}>Tháng</Text>
                </View>

                <View style={{flexDirection:'row', alignItems:'center', marginLeft:'50%', marginTop: 20, marginBottom: 10}}>
                    <View>
                        <Text style={{fontSize: 17, }}>Tháng: </Text>
                    </View>
                    <View style={{width: 100, borderWidth: 0.5, height: 40, justifyContent:'center'}}>
                        <Picker
                            style={{height: 40, width: 100, padding: 5}}
                            selectedValue={selectedColor}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedColor(itemValue)
                            }>
                            {listMonth}
                        </Picker>
                    </View>
                </View>

                <View style={{width: '100%', flexDirection:'row', justifyContent:'space-around'}}>
                    <LinearGradient colors={['#ffff', 'yellow', '#fff']} style={{width: '40%',height: 100,justifyContent:'center', alignItems:'center', borderRadius: 10}}>
                        <Text style={{fontSize: 30}}>15</Text>
                        <Text style={{fontSize: 15}}>Đơn hàng</Text>
                    </LinearGradient>

                    <LinearGradient colors={['red', 'white', 'green']} style={{width: '40%', height: 100,justifyContent:'center', alignItems:'center', borderRadius: 10}}>
                        <Text style={{fontSize: 18, marginTop: 15}}>14.000.000 VNĐ</Text>
                        <Text style={{fontSize: 15, marginTop: 5}}>Tổng tiền</Text>
                    </LinearGradient>

                </View>
            </View>
            <View style={{flex:2, backgroundColor:'brown'}}></View>
        </View>
    )
}

export default statisticalScreen

const styles = StyleSheet.create({})