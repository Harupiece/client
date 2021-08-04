import { PortableWifiOffSharp } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";

const Button = ({ 
  width,
  height,
  bg,
  color, 
  fontsize, 
  _onClick,
  text,
  children,
  type,
  padding,
  }) => {
  const styles = 
  {  
    width, 
    height, 
    bg, 
    color, 
    fontsize,
    padding,
  };
  return (
  <ElButton 
  onClick={_onClick}
  type={type} 
  {...styles}
  >
    {text ? text : children}
  </ElButton>)
  ;
};

Image.defaultProps = {
  children: null,
  width: false,
  color: false,
  padding: false,
  bg: false,
  text: false,
  fontsize: false,
  _onClick: () => {},
  
  type: "",
};

export default Button;

const ElButton = styled.button`
  width: ${(props) => (props.width ? props.width : "auto")};
  padding: ${(props) => (props.padding ? props.padding : "auto")};
  background-color: ${(props) =>
    props.bg ? props.theme.colors[props.bg] : props.theme.colors.mainGreen};
  color: ${(props) =>
    props.color ? props.theme.colors[props.color] : props.theme.colors.white};
  font-size: ${(props) =>
    props.fontsize ? props.theme.fontSizes[props.fontSizes] : props.theme.fontSizes.md};
  border-radius: 5px;
`;
