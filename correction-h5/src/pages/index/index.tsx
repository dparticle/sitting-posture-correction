import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Circle, Icon } from "@antmjs/vantui"

import './index.less'

const Index = (props: any) => {
  const [ play, setPlay ] = useState(false)

  const onPlay = () => {
    setPlay(true)
  }

  const onStop = () => {
    setPlay(false)
  }

  useEffect(() => {
  }, [])

  return (
    <View className='index'>
      <View className='stat'>
        <Icon
          className='btn-stat position-center'
          name='chart-trending-o'
          size='20px'
          color='#999'
        />
      </View>
      <View className='countdown'>
        <Circle
          className='circle'
          value={ 100 }
          size={ 200 }
          strokeWidth={ 10 }
          color={ {
            '0%': '#7f7fd5',
            '50%': '#86a8e7',
            '100%': '#91eae4'
          } }
          clockwise={ false }
        >
          <Text className='time position-center'>
          20:00
          </Text>
        </Circle>
      </View>
      <View className='control'>
        {play ? (
          // 开始按钮组
          <>
            <View className='btn-control'>
              <Icon
                className='position-center'
                name='pause'
                size='32px'
                color='#3498db'
              />
            </View>
            <View className='btn-control' onClick={onStop}>
              <Icon
                className='position-center'
                name='stop'
                size='44px'
                color='#e74c3c'
              />
            </View>
          </>
        ) : (
          // 未开始按钮组
          <>
            <View className='btn-control' onClick={onPlay}>
              <Icon
                className='position-center'
                name='play'
                size='32px'
                color='#2ecc71'
              />
            </View>
            <View className='btn-control'>
              <Icon
                className='position-center'
                name='setting'
                size='28px'
                color='#34495e'
              />
            </View>
          </>
        )}
      </View>
    </View>
  )
}

export default Index
