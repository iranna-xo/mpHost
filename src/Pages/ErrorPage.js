import React, { Component } from "react";
import { useNavigate } from "react-router-dom";




class ErrorPage extends Component{
  render(){
    return(
      <div>
        <center><h3>
        This is Error Page
        </h3></center></div>
    )
  }

}


export default function ErrorFunction() {
  const nav = useNavigate(); // extract navigation prop here

  return <ErrorPage nav={nav} />; //pass to your component.
}