import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { HeaderButton, HeaderButtonProps } from "react-navigation-header-buttons";
import { colors } from "../constants";

const CustomHeaderButton = (props: HeaderButtonProps) => {
	return <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} color={props.color ?? colors.blue} />;
};

export default CustomHeaderButton;
