import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ShowListScreen from './screens/ShowListScreen';
import SearchScreen from './screens/SearchScreen';
import DetailsScreen from './screens/DetailsScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TrackedShowsProvider } from './TrackedShowsContext'; // import your new context!


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="SearchPage" component={SearchScreen} options={{ title: 'Search' }}/>

      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

function ShowListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ShowList" component={ShowListScreen} options={{ title: 'Tracked Shows' }} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}



function getTabBarStyle(route) {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (routeName === 'Details') {
    return { display: 'none' };
  }

  return {};
}


export default function App() {
  return (
    <TrackedShowsProvider>
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen
  name="Tracked Shows"
  component={ShowListStack}
  options={({ route }) => ({
    tabBarStyle: getTabBarStyle(route),
    headerShown: false,
  })}
/>

        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={({ route }) => ({
            tabBarStyle: getTabBarStyle(route),
            headerShown: false,
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </TrackedShowsProvider>
  );
}