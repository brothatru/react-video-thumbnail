/**
 * React Video Thumbnail Component
 * @author mike trieu
 */
import React from 'react';
import PropTypes from 'prop-types';
import './video-thumbnail.css';

/**
 * Simple component that renders thumbnail url
 * @param {string} snapshot
 */
const ThumbnailImage = ({ snapshot }) => {
    return (
        <div className="react-thumbnail-generator" >
            <img src={snapshot} alt="my video thumbnail" />
        </div>
    );
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
            cors: props.cors,                           // boolean
            width: props.width,                         // number
            height: props.height,                       // number
            renderThumbnail: props.renderThumbnail,     // boolean
            snapshotAtTime: props.snapshotAtTime,       // number
            thumbnailHandler: props.thumbnailHandler,   // callback function
            videoUrl: props.videoUrl,                   // string
        }
    }

    render() {
        const { renderThumbnail, snapshot, videoUrl } = this.state;
        if (!snapshot) {
            return (
                <div className="react-thumbnail-generator" >
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

    /**
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
        if (!this.state.cors) this.refs.videoEl.setAttribute('crossOrigin', 'Anonymous');
        // console.log('mount state: ', this.state)
    }

    /**
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

    /**
     * Create a canvas and video element to "draw" the
     * image, then convert it to a data url
     */
    getSnapShot = () => {
        try {
            const { width, height } = this.props;
            const video = this.refs.videoEl;
            const canvas = this.refs.canvas;
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;

            // resize thumbnail or no ?
            if (!width || !height) {
                canvas.getContext('2d').drawImage(video, 0, 0);
            } else {
                canvas.getContext('2d').drawImage(video, 0, 0, width, height);
            }

            const thumbnail = canvas.toDataURL('image/png');

            // Remove video & canvas elements (no longer needed)
            video.src = "";  // setting to empty string stops video from loading
            video.remove();
            canvas.remove();

            this.setState({
                snapshot: thumbnail
            })

            // pass the thumbnail url back to parent component's thumbnail handler (if any)
            if (this.state.thumbnailHandler) {
                this.state.thumbnailHandler(thumbnail);
            }

        } catch (e) {
            console.error(e);
        }
    }
}

/**
 * Property Types
 */
VideoThumbnail.propTypes = {
    cors: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    renderThumbnail: PropTypes.bool,
    snapshotAtTime: PropTypes.number,
    thumbnailHandler: PropTypes.func,
    videoUrl: PropTypes.string.isRequired,
}

/**
 * Default Properties
 */
VideoThumbnail.defaultProps = {
    cors: false,
    renderThumbnail: true,
    snapshotAtTime: 2,
}