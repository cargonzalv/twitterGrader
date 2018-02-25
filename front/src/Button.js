var React = require('react');



var Button = React.createClass({
  render: function () {
    return (
      <button
        className="btn"
        style={this.props.buttonStyle}
        onClick={this.props.handleClick}>{this.props.label}</button>
    );
  }
});

module.exports = Button;