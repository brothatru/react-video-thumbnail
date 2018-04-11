import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VideoThumbnail from '../src/components/VideoThumbnail'; // use npm published version

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Example Thumbnail</h1>
                <VideoThumbnail
                    videoUrl="https://dl.dropboxusercontent.com/s/7b21gtvsvicavoh/statue-of-admiral-yi-no-audio.mp4?dl=1"
                    thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                    />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
