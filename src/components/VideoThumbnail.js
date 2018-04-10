/*
 * https://stackoverflow.com/a/36883038/4364074
 */
import React from 'react';
import PropTypes from 'prop-types';
import './video-thumbnail.css';

const ThumbnailImage = ({snapshot}) => {
    return (
        <div className="react-thumbnail-generator" >
            <img src={snapshot} alt="my video thumbnail" />
        </div>
    )
}

export default class VideoThumbnail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false,      // boolean
            metadataLoaded: false,  // boolean
            seeked: false,          // boolean
            snapshot: false,        // string thumbnail url || false
            suspended: false,       // boolean
            // props
            renderThumbnail: props.renderThumbnail,    // boolean
            snapshotAtTime: props.snapshotAtTime,      // number
            thumbnailHandler: props.thumbnailHandler,  // callback function
            videoUrl: props.videoUrl,                  // string
        }
    }

    render() {
        const { renderThumbnail, snapshot, videoUrl } = this.state;
        if (!snapshot) {
            return (
                <div className="react-thumbnail-generator" >
                    <h1>Thumbnail Generator</h1>
                    <canvas className="snapshot-generator" ref="canvas" ></canvas>
                    <video muted
                        className="snapshot-generator"
                        ref="videoEl"
                        src={videoUrl}
                        onLoadedMetadata={() => this.setState({ metadataLoaded: true })}
                        onLoadedData={() => this.setState({ dataLoaded: true })}
                        onSuspend={() => this.setState({ suspended: true })}
                        onSeeked={() => this.setState({ seeked: true })}
                    >
                    </video>
                </div>
            )
        } else {
            if (renderThumbnail) {
                return <ThumbnailImage snapshot={snapshot} />;
            } else {
                return null;
            }
        }
    }

    /* 
    * React Lifecycle Hook
    * Update any props that may have changed
    */
    componentWillReceiveProps(nextProps) {
        let stateChanged = false;
        const data = {};
        for (let prop in nextProps) {
            if (nextProps[prop] !== this.props[prop]) {
                data[prop] = nextProps[prop];
                if (!stateChanged) {
                    stateChanged = true;
                }
            }
        }
        if (stateChanged) {
            this.setState(data);
        }
    }

    componentDidMount() {
        // this.refs.videoEl.setAttribute('crossOrigin', 'Anonymous');
        console.log('mount state: ', this.state)
    }

    /*
     * React Lifecycle Hook:
     * (fires every time setState() gets called)
     */
    componentDidUpdate(prevProps, prevState) {
        if (!this.state.snapshot) {
            const { metadataLoaded, dataLoaded, suspended, seeked, snapshot, snapshotAtTime } = this.state;

            // check if all 3 required events fired
            if (metadataLoaded && dataLoaded && suspended) {
                if (!this.refs.videoEl.currentTime || this.refs.videoEl.currentTime < this.state.snapshotAtTime) {
                    this.refs.videoEl.currentTime = snapshotAtTime;
                }

                if (seeked && !snapshot) {
                    // attempt to generate thumbnail
                    this.getSnapShot();
                }
            }
        }
    }

    getSnapShot() {
        const video = this.refs.videoEl;
        const canvas = this.refs.canvas;
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        canvas.getContext('2d').drawImage(video, 0, 0);

        try {
            const thumbnail = canvas.toDataURL('image/png');

            this.setState({
                snapshot: thumbnail
            })
            
            // pass the thumbnail url back to parent component's thumbnail handler (if any)
            if (this.state.thumbnailHandler) {
                this.state.thumbnailHandler(thumbnail);
            }

        } catch (e) {
            console.log(e);
        }
    }

}

VideoThumbnail.propTypes = {
    renderThumbnail: PropTypes.bool,
    snapshotAtTime: PropTypes.number,
    thumbnailHandler: PropTypes.func,
    videoUrl: PropTypes.string.isRequired,
}

VideoThumbnail.defaultProps = {
    renderThumbnail: true,
    snapshotAtTime: 2,
}