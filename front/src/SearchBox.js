import React, { Component } from 'react';
import logo from './logo.svg';

class SearchBox extends Component {
  onKeyPress(evt){
    if(evt.key == "Enter")
      this.props.onSearch(evt.target.value)
  }
  render() {

    return (
      <div className="SearchBox">
      <input type="text"
      ref={(input)=>this.input = input}
      onKeyPress={this.onKeyPress.bind(this)}/>
      </div>
      );
  }
}

export default SearchBox;
