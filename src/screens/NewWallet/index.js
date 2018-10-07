import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text, Input, Item, H3, Toast
} from "native-base";
import styles from "./styles";
import { ImageBackground, StatusBar } from "react-native";

var ethers = require("ethers");
var CryptoJS = require("crypto-js");
const launchscreenBg = require("../../../assets/Backk.png");


export default class NewWallet extends Component {
  //输入账户密码，新建以太坊账户传到Prebackup去备份
  constructor(props) {
    super(props);
    this.state = {
      pin: "",
      loading: ""
    };
  }

  _newWallet() {

    var promies = new Promise((resolve, reject) => {
      alert("正在生成以太坊账户,请等待");
      resolve(); //异步处理
    });
    promies.then(() => this.sendData());
    // promies.then(() => {
    //   var wallet = ethers.Wallet.createRandom();
    //   this.setState({ mnemonic: wallet.mnemonic });
    //   console.log(this.state);
    //   this.setState({ loading: "生成以太坊账户成功" });
    //   Toast.show({
    //     text: "生成以太坊账户成功",
    //     buttonText: "Okay"
    //   });
    //   this.props.navigation.navigate("PreBackup", { wallet: wallet, pin: this.state.pin });
    // });
  }

  sendData() {

    var wallet = ethers.Wallet.createRandom();
    Toast.show({
      text: "生成以太坊账户成功",
      buttonText: "Okay"
    });
    this.props.navigation.navigate("PreBackup", { wallet: wallet, pin: this.state.pin });
  }

  render() {
    return (
      <Container style={styles.container}>

        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back"/>
              </Button>
            </Left>
            <Body>
            <Title>新建</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Content padder>
            <H3 style={{ color: "#000", alignSelf: "center" }}>输入账户密码</H3>
            <Text style={{ color: "#000", alignSelf: "center" }}>账户密码用于交易签名。我们不存储账户密码，无法提供找回功能，请牢记</Text>
            <Item>
              <Input bordered placeholder="输入账户密码" onChangeText={(pin) => {
                console.log(pin);
                this.setState({ pin: pin });
              }}/>
            </Item>
            <Button
              full
              style={{ borderRadius: 30, marginLeft: 20, marginRight:20,marginTop:20, height: 60 }}
              onPress={() => {

                this._newWallet();
              }}>
              <Text style={{ color: "#fff", fontSize: 20 }}>下一步</Text>
            </Button>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}
