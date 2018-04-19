import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VideoThumbnail from '../src/index';

Enzyme.configure({ adapter: new Adapter() });

const VIDEO_URL = 'https://dl.dropboxusercontent.com/s/7b21gtvsvicavoh/statue-of-admiral-yi-no-audio.mp4?dl=1';


test('it should render', () => {
    const thumbCmp = mount(<VideoThumbnail videoUrl={VIDEO_URL} width={1} height={1} />);
    expect(thumbCmp.find('.react-thumbnail-generator').length).toBe(1);

    console.log({ state: thumbCmp.state() })
    const { dataLoaded, metaLoaded, seeked, suspended } = thumbCmp.state();
    // expect(dataLoaded).toBe(true);
})