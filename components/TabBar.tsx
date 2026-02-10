import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, ShoppingBag, User, UtensilsCrossed } from 'lucide-react-native';
import React from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const [dimensions, setDimensions] = React.useState({ height: 20, width: 100 });

    const buttonWidth = dimensions.width / state.routes.length;

    const onTabbarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    };

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    });

    return (
        <View style={styles.tabBarContainer}>
            <View onLayout={onTabbarLayout} style={styles.tabBar}>
                <Animated.View
                    style={[
                        animatedStyle,
                        {
                            position: 'absolute',
                            backgroundColor: '#4A3728',
                            borderRadius: 30,
                            marginHorizontal: 12,
                            height: dimensions.height - 15,
                            width: buttonWidth - 25,
                            top: 7.5, // Center vertically
                        },
                    ]}
                />
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        tabPositionX.value = withSpring(buttonWidth * index, {
                            stiffness: 150,
                            damping: 18,
                            mass: 1,
                            overshootClamping: false,
                        });

                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const Icon = () => {
                        const color = isFocused ? "#FFF" : "#8D7B6D";
                        const size = 24;

                        switch (route.name) {
                            case 'home': return <Home size={size} color={color} />;
                            case 'menu': return <UtensilsCrossed size={size} color={color} />;
                            case 'orders': return <ShoppingBag size={size} color={color} />;
                            case 'profile': return <User size={size} color={color} />;
                            default: return <Home size={size} color={color} />;
                        }
                    }

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            key={route.key}
                            style={styles.tabItem}
                        >
                            <Icon />
                            {/* Optional: Add Text Label if needed, but icon-only looks cleaner with this animation */}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
        height: 70,
        width: '100%',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default TabBar;
