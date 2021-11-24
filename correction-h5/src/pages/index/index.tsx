import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Circle, Icon, Grid, GridItem } from "@antmjs/vantui"

import './index.less'
import Taro from '@tarojs/taro'

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
        <View className='stat-item grid-split'>
          <View>
            <Text className='stat-num'>230</Text>
            <Text className='stat-unit'> min</Text>
          </View>
          <Text className='stat-desc'>总时长</Text>
        </View>
        <View className='stat-item grid-split'>
          <View>
            <Text className='stat-num success-text'>12</Text>
            <Text className='stat-unit'> time</Text>
          </View>
          <Text className='stat-desc'>成功次数</Text>
        </View>
        <View className='stat-item'>
          <View>
            <Text className='stat-num fail-text'>2</Text>
            <Text className='stat-unit'> time</Text>
          </View>
          <Text className='stat-desc'>失败次数</Text>
        </View>
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
          speed={ 50 }  // 若不设置 speed，ios 动画很慢
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
