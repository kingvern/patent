import { ImageBackground } from "react-native";

var ethers = require("ethers");
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
  Text, Tab, Tabs, Label, Input, Item, Textarea
} from "native-base";
import styles from "./styles";

const launchscreenBg = require("../../../assets/Backk.png");
export default class PreBackup extends Component {
  // 从NewWallet或MyWallet传进参数：wallet，pin
  // 到Backup传出参数：wallet，pin
  constructor(props) {
    super(props);
    this.state = {
      wallet: this.props.navigation.state.params.wallet,
      mnemonic: this.props.navigation.state.params.wallet.mnemonic,
      pin: this.props.navigation.state.params.pin
    };
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
            <Title>备份以太坊账户</Title>
            </Body>
            <Right>
            </Right>
          </Header>

          <Content padder>
            <Text>请记录您的以太坊账户的助记词并保存到安全的地方</Text>
            <Text>以太坊账户助记词用于恢复您的账户。任何时候都不要泄露您的助记词，建议不要使用截屏保存或通过互联网工具传输</Text>
            <Text>{this.state.mnemonic}</Text>
            <Button

              full
              style={{ borderRadius: 30, marginLeft: 20, marginRight:20,marginTop:20, height: 60 }}
              onPress={() => {
                this.props.navigation.navigate("Backup", { wallet: this.state.wallet, pin: this.state.pin });
              }}>
              <Text style={{ color: "#fff", fontSize: 20 }}>下一步</Text>
            </Button>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

