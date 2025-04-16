import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="personalusage" 
            options={{ 
                title: 'Usage',
                headerShown: false 
            }} 
        />
        <Tabs.Screen name="usagesummary" 
            options={{ 
                title: 'Summary',
                headerShown: false 
            }} 
        />
        <Tabs.Screen name="profile" 
            options={{ 
                title: 'Profile',
                headerShown: false 
            }} 
        />
        <Tabs.Screen name="notifications" 
            options={{ 
                title: 'Notifications',
                headerShown: false 
            }} 
        />
        <Tabs.Screen name="settings" 
            options={{ 
                title: 'Settings',
                headerShown: false 
            }} 
        />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})