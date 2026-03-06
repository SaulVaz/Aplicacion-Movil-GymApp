import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator }  from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Pantallas de autenticación
import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

// Pantallas principales
import RoutinesScreen  from '../screens/main/RoutinesScreen';
import ExercisesScreen from '../screens/main/ExercisesScreen';
import SessionsScreen  from '../screens/main/SessionsScreen';
import ProfileScreen   from '../screens/main/ProfileScreen';
import CreateRoutineScreen from '../screens/main/CreateRoutineScreen';
import RoutineDetailScreen from '../screens/main/RoutineDetailScreen';
import WorkoutScreen from '../screens/main/WorkoutScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// Tabs principales (usuario logueado)
const MainTabs = () => (
  <Tab.Navigator 
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#000',
        borderTopColor: '#222',
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarActiveTintColor: '#FF0000',
      tabBarInactiveTintColor: '#666',
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Rutinas') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Ejercicios') {
          iconName = focused ? 'barbell' : 'barbell-outline';
        } else if (route.name === 'Historial') {
          iconName = focused ? 'time' : 'time-outline';
        } else if (route.name === 'Perfil') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={24} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Rutinas"    component={RoutinesScreen}  />
    <Tab.Screen name="Ejercicios" component={ExercisesScreen} />
    <Tab.Screen name="Historial"  component={SessionsScreen}  />
    <Tab.Screen name="Perfil"     component={ProfileScreen}   />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
            <>
              <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'none' }} />
              <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen}/>
              <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen}/>
              <Stack.Screen name="Workout" component={WorkoutScreen} />
            </>
          ) : (
          <>
            <Stack.Screen name="Welcome"  component={WelcomeScreen}  />
            <Stack.Screen name="Login"    component={LoginScreen}    />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}