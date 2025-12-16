import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CompanyTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#0EA5E9',
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    backgroundColor: '#0F172A',
                    borderTopColor: '#1E293B',
                    borderTopWidth: 1,
                },
                headerStyle: {
                    backgroundColor: '#0F172A',
                    height: 80,
                },
                headerTintColor: '#2f95dc',
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Doltech',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    title: 'Doltech',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="applicants"
                options={{
                    title: 'Doltech',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Doltech',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
