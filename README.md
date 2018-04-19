# React Video Thumbnail
Given a video url, attempt to generate a video thumbnail using HTML Canvas Element

Note*: The **`<Canvas>`** element will only be able to generate a thumbnail, if CORS allows it.

If not, you may see a similar console error as below:
```
DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
```

Please read about [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), if you would like more details on how it works.


## Installation

```bash
git clone https://github.com/brothatru/react-video-thumbnail.git
```
OR
```bash
npm install --save-dev react-video-thumbnail
```

## Usage

```es6
import VideoThumbnail from 'react-video-thumbnail'; // use npm published version
...
<VideoThumbnail
    videoUrl="https://dl.dropboxusercontent.com/s/7b21gtvsvicavoh/statue-of-admiral-yi-no-audio.mp4?dl=1"
    thumbnailHandler={(thumbnail) => console.log(thumbnail)}
    width={120}
    height={80}
    />
```


## Properties

| Prop Name | Type | Default | Description |
| --- | --- | --- | --- |
| **videoUrl** (Required) | **string** | | The url of the video you want to generate a thumbnail from |
| **cors** | **bool** | false |Whether or not to set **crossOrigin** attribute to **anonymous**. |
| **height** | **int** | | Resize thumbnail to specified height |
| **renderThumbnail** | **bool** | true | Whether to render an image tag and show the thumbnail or not. |
| **snapshotAtTime** | **int** | 2 | The second at which the component should snap the image at. |
| **thumbnailHandler** | **func** | | Callback function that takes in **thumbnail** url as an argument |
| **width** | **int** | | Resize thumbnail to specified width |

*Note: The longer the snapshotAtTime, the more video data it may have to download.

## Examples


## Contributors

- mike trieu [@brothatru](https://github.com/brothatru)

