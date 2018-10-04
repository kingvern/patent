import React from "react";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation"
import 'babel-preset-react-native-web3/globals';

import MainPage from "./screens/MainPage";
import ImportWallet from "./screens/ImportWallet";
import NewWallet from "./screens/NewWallet";
import MyWallet from "./screens/MyWallet";
import PreBackup from "./screens/PreBackup";
import Backup from "./screens/Backup";
import PinPage from "./screens/PinPage";

const AppNavigator = StackNavigator(
  {
    MainPage: { screen: MainPage },
    ImportWallet: { screen: ImportWallet },
    NewWallet: { screen: NewWallet },
    MyWallet: { screen: MyWallet },
    PreBackup: { screen: PreBackup },
    Backup: { screen: Backup },
    PinPage: { screen: PinPage },
  },
  {
    initialRouteName: "MainPage",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
