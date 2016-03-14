var React = require('react');
var Router = require('react-router');
var Link = Router.Link;


var error404 = React.createClass({
	render(){
        return (
           <div id="notFound">
             <h1>error</h1>
             <p>We cannot find the page you requested. You can try this :</p>
             <Link to="/">Join as a audience</Link>
             <Link to="/speaker">Start the presentation</Link>
             <Link to="/board">view the board</Link>
           </div>
        	);
	}
});

module.exports = error404;