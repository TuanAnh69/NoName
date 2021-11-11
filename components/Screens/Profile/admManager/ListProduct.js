import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  Alert,
  Button,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles';
import {AddCart, AddToFavorite} from '../../../Store/action';
import firestore, {firebase} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, TouchableRipple, ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';

const listTab = [
  {
    status: 'Tất cả',
    type: 0,
  },
  {
    status: 'Công nghệ',
    type: 1,
  },
  {
    status: 'Thời trang',
    type: 2,
  },

  {
    status: 'Đồ chơi',
    type: 3,
  },
];

function ListProduct({AddToFavorite}) {
  
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  //const [heart, setHeart] = useState('heart-outline');
  const [isLoading, setIsLoading] = useState(true);
  const [statusType, setStatusType] = useState(0);

  const Favorites = useSelector(state => state.favourites.favoriteProduct);
  console.log('yêu thích:', Favorites.length);
  const [dataList, setDataList] = useState([]);

  useEffect(async () => {
    const subscriber = await firestore()
      .collection('Products')
      .onSnapshot(querySnapshot => {
        const productss = [];

        querySnapshot.forEach(documentSnapshot => {
          productss.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setIsLoading(false);
        setProducts(productss);
        setDataList(productss);
      });
    
    return () => subscriber();
  }, []);

  function formatCash(str) {
    var money = '' + str;
    return money
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + '.') + prev;
      });
  }

  const customShare = async url => {
    const shareOptions = {
      message: 'Tải ngay app để order nhé!',
      url: url,
    };
    try {
      const shareRespone = await Share.open(shareOptions);
    } catch (error) {
      console.log(error);
    }
  };
  //console.log('data:', products);

  
  const setStatusFillter = getType => {
    if (getType === 0) {
      setDataList(products);
    } else {
      setDataList([...products.filter(e => e.type === getType)]);
    }
    setStatusType(getType);
  };

  return (
    <SafeAreaView>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={Colors.blue500} />
        </View>
      ) : (
        <View style={styles.listProduct}>
          <View
            style={{
              height: 10,
              width: '100%',
              marginTop: 15,
              borderTopWidth: 0.5,
              borderRightWidth: 0.5,
              borderLeftWidth: 0.5,
              borderLeftColor: 'red',
              borderTopColor: 'black',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              height: 30,
              width: '93%',
              marginTop: 1,
              marginLeft: '3%',
            }}>
            {listTab.map((e, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.styleBtnTab,
                  statusType === e.type && styles.btnTabActive,
                ]}
                onPress={() => {
                  console.log(e.type);
                  setStatusFillter(e.type);
                }}>
                {e.type == 0 && <Text style={styles.textTab}>Tất cả</Text>}
                {e.type == 1 && <Text style={styles.textTab}>Công nghệ</Text>}
                {e.type == 2 && <Text style={styles.textTab}>Thời trang</Text>}
                {e.type == 3 && <Text style={styles.textTab}>Đồ chơi</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <View style={{marginTop: 10}}>
            <FlatList
              data={dataList}
              renderItem={({item, index}) => (
                <TouchableNativeFeedback
                  onPress={() =>
                    navigation.navigate('Details', {
                      product: item,
                    })
                  }>
                  <View style={styles.item} key={index}>
                    <View style={styles.wrappIMG}>
                      <Image
                        source={{uri: item.url[0]}}
                        style={styles.image}
                        resizeMode={'stretch'}
                      />
                    </View>
                    <View style={styles.wrappInfo}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <Text style={styles.name}>{item.name}</Text>
                      </View>
                    </View>
                    <View style={styles.wrapAvaiable}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <Text style={styles.price}>
                          Giá: {formatCash(item.price)} VNĐ
                        </Text>
                      </View>
                    </View>
                    <View style={styles.wrappIcon}>
                      <View
                        style={{
                          bottom: 0,
                          width: 31,
                          height: 30,
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 5,
                          borderColor: '#fff',
                        }}>
                          {
                            Favorites.length === 0 && (
                              <Icon
                              name="heart-outline"
                              size={25}
                              style={{color: 'red', marginRight: 0}}
                              onPress={() => {
                                AddToFavorite(item);
                                //setHeart('cards-heart');
                              
                              }}
                            />)

                          }
                          {
                            Favorites.length !== 0 && 
                            Favorites.map(e=> {
                              if(e.id === item.id)
                              {
                                return (
                                  <Icon
                                  name="cards-heart"
                                  size={25}
                                  style={{color: 'red', marginRight: 0}}
                                  onPress={() => {
                                    AddToFavorite(item);
                                    //setHeart('cards-heart');
                                  
                                  }}
                                />
                                )
                              } else {
                                return(
                                  <Icon
                                  name="heart-outline"
                                  size={25}
                                  style={{color: 'red', marginRight: 0}}
                                  onPress={() => {
                                    AddToFavorite(item);
                                    //setHeart('cards-heart');
                                  
                                  }}
                                  />)
                              }
                          })
                          }  
                      
                        
                      </View>
                      <View
                        style={{
                          width: 31,
                          height: 30,
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 5,
                          borderColor: '#fff',
                        }}>
                        <Icon
                          name="share-variant"
                          size={25}
                          style={styles.cartIcon}
                          color={Colors.red400}
                          onPress={() => customShare(item.url[0])}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              )}
              keyExtractor={(item, index) => index}
              numColumns={2}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
const mapDispatchToProps = dispatch => ({
  AddToFavorite: item => dispatch(AddToFavorite(item)),
});

export default connect(mapDispatchToProps, {AddToFavorite})(ListProduct);
