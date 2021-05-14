import axios from 'axios';

if (process.env.REACT_APP_DEMO_MODE == "yes")
{
    console.log("Running in demo")
    axios.delete = function(req, param) {
        alert("HurraCloud is running in demo read-only mode. Please install it on your device if you are interested in experimenting this feature. It's free!")
        return new Promise(resolve => {

        });
    }

    axios.post = function(req, param) {
        alert("HurraCloud is running in demo read-only mode. Please install it on your device if you are interested in experimenting this feature. It's free!")
        return new Promise(resolve => {

        });
    }
}

export default axios