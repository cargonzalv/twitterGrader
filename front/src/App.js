import React, { Component } from 'react';
import './App.css';
import Tweet from "react-tweet"
import Button from "./Button"
import DatePicker from 'react-datepicker';
import moment from "moment";
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      startDate: moment()

    }
  this.handleClick = this.handleClick.bind(this);
  this.handleChange = this.handleChange.bind(this);
  }
  handleChange(date) {
    this.setState({
      startDate: date
    });
    this.renderTweets();
  }
  renderTweets(){
    fetch("/getTweets?date="+this.state.startDate.format("YYYY-MM-DD"))
    .then((res)=>res.json())
    .then((data)=> {
      if(data.error){
        window.alert("No ha sido posible encontrar al usuario especificado");
      }
      this.setState({data:data.statuses});
      })
    .catch(error  => {
      console.log('There has been a problem with your fetch operation: '+ error.message);
    });
  }
  handleClick(user,calification){
    fetch("/rateTweet/"+user + "?semana="+this.state.startDate.format("MM-DD")+"&calificacion="+calification)
  }
  render() {
    var button1Style = {
      margin: '10px 10px 10px 0',
      backgroundColor:"#FFFFFF"
    };
    var button2Style = {
      margin: '10px 10px 10px 0',
      backgroundColor:"#b7d4ee"
    };
    var button3Style = {
      margin: '10px 10px 10px 0',
      backgroundColor:"#6fa8dc"
    };
  
    console.log("hizo render")
    return (
      <div className="App"> 
        <div className="App-header">

          <div>
            <h1>Twitter Grader</h1>
            <h2>Selecciona la fecha correspondiente a la clase</h2>
            <DatePicker
              dateFormat="MM-DD"
              selected={this.state.startDate}
              onChange={this.handleChange}
            />
            </div>
            </div>

      <ul className="lists row">
      {!this.state.data && this.renderTweets()}
      {this.state.data && this.state.data.map((tweet,i)=>{
        var linkProps = {target: '_blank', rel: 'noreferrer'};
        console.log(tweet)
        return (
          <li className = "col-md-4" key = {i}>
            <div className = "tweet-container">
            <Tweet data={tweet} linkProps={linkProps} />
            <Button handleClick={()=> this.handleClick(tweet.user.screen_name,0)} buttonStyle={button1Style} label="0"/>
            <Button handleClick={()=> this.handleClick(tweet.user.screen_name,1)} buttonStyle={button2Style} label="+1"/>
            <Button handleClick={()=> this.handleClick(tweet.user.screen_name,2)} buttonStyle={button3Style} label="+2"/>
            </div>


          </li>
          )

      })
      }
      </ul>
  </div>
    );
  }
}

export default App;
