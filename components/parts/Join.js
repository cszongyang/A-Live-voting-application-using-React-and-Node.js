var React = require('react');
var Link = require('react-router').Link;

var Join = React.createClass({

    join(){
        var memberName = React.findDOMNode(this.refs.name).value;
        alert("TODO: Join member " + memberName);
        this.props.emit('join', {name: memberName});
    },

	render(){
         return(
           	<form action="javascript:void(0)" onSubmit={this.join}>
                 <label>Full Name</label>
                 <input ref="name" className="form-control" placeholder="Enter your full name" required />
                 <button className="btn btn-primary">Join</button>
                 <Link to="/speaker">Join to as a speaker</Link>
                 <Link to="/board">Go to the board</Link>
		    </form>

         	)
	}
});

module.exports = Join;