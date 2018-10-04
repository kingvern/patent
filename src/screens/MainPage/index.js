var ethers = require("ethers");
import React, { Component } from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import { Container, Button, H3, Text } from "native-base";

import styles from "./styles";

import { AsyncStorage } from "react-native";
import util from "../../util/util.js";

const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-kitchen-sink.png");

export default class MainPage extends Component {
  // 入口页面
  // 判断已登录转到MyWallet传出参数：wallet，pin
  constructor(props) {
    super(props);
    this.state = { logined: false };
  }

  componentDidMount() {
    this._checkStorage();
  }

  _checkStorage() {
    AsyncStorage.getItem("data").then((data) => {
      console.log(data);
      if (data) {
        var walletData = JSON.parse(data);
        console.log(walletData);
        if (walletData.address) {
          this.setState({
            logined: true,
            walletData: walletData
          });
        }
      } else {
        this.setState({ logined: false });
      }
    }).then(() => {
        if (this.state.logined) {
          console.log(this.state.walletData);
          this.props.navigation.navigate("MyWallet", { type: "login", walletData: this.state.walletData });
        }
      }
    ).catch(arg => console.log(arg));

  }

  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content"/>
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
          </View>
          <View
            style={{
              alignItems: "center",
              marginBottom: 50,
              backgroundColor: "transparent"
            }}
          >
            <H3 style={styles.text}>在请先创建一个账户</H3>
            <View style={{ marginTop: 8 }}/>
            <Text style={styles.text}>可以通过新建或导入以太坊钱包创建账户</Text>
            <View style={{ marginTop: 8 }}/>
          </View>
          <View style={{ marginBottom: 80 }}>
            <Button
              style={{ backgroundColor: "#000", alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("NewWallet")}
            >
              <Text>新建账户</Text>
            </Button>
          </View>
          <View style={{ marginBottom: 80 }}>
            <Button
              style={{ backgroundColor: "#fff", alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("ImportWallet")}
            >
              <Text style={{ color: "#000" }}>导入账户</Text>
            </Button>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}


