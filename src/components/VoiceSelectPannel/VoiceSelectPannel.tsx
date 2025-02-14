import React from 'react'
import { Toggle } from '@fluentui/react'

interface Props {
    onVoiceSelectPannelToggel: () => void;
}

const VoiceSelectPannel = ({onVoiceSelectPannelToggel} : Props) => {
  return (
    <div >
        <Toggle label='Voice Enable' inlineLabel onText="On" offText="Off" onChange={onVoiceSelectPannelToggel} />
    </div>
  )
}

export default VoiceSelectPannel

