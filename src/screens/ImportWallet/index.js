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
  Text,
  H3,
  Textarea
} from "native-base";
import styles from "./styles";
import { ImageBackground } from "react-native";

var ethers = require("ethers");

const launchscreenBg = require("../../../assets/Backk.png");

export default class ImportWallet extends Component {
  //传导入的以太坊账户到PinPage设置账户密码
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: "live zone improve reveal alert march injury squirrel only name test price"
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
          <Title>导入以太坊账户</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder>
          <H3>助记词</H3>
          <Textarea rowSpan={5} bordered placeholder="输入助记词，按空格分隔"
                    onChangeText={(mnemonic) => this.setState({ mnemonic })}
                    value={this.state.mnemonic}/>
          <Button full
                  style={{ borderRadius: 30, marginLeft: 20, marginRight:20,marginTop:20, height: 60 }}
                  onPress={() => {
                    var mnemonic = this.state.mnemonic;
                    var wallet = ethers.Wallet.fromMnemonic(mnemonic);
                    this.setState({ wallet: wallet });
                    this.props.navigation.navigate("PinPage", { wallet: wallet });
                  }}>
            <Text>确定</Text>
          </Button>
        </Content>
        </ImageBackground>
      </Container>
    );
  }
}

