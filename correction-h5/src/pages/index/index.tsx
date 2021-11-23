import React, { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

const Index = (props: any) => {
  const dispatch = useDispatch()
  const {num} = useSelector(state => state.counter) // 忽略 IDE 报错
  console.log('num', num);


  useEffect(() => {
    dispatch(asyncAdd())
  }, [])

  return (
      <View className='index'>
        <Button className='add_btn' onClick={() => dispatch(add())}>+</Button>
        <Button className='dec_btn' onClick={() => dispatch(minus())}>-</Button>
        <Button className='dec_btn' onClick={() => dispatch(asyncAdd())}>async</Button>
        <View><Text>{num}</Text></View>
        <View><Text>Hello, World</Text></View>
      </View>
    )
}

export default Index
