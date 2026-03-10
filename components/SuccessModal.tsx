import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { CheckCircle } from "lucide-react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  FadeIn
} from "react-native-reanimated";

interface SuccessModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  visible, 
  message, 
  onClose, 
  duration = 2000 
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12 });
      opacity.value = withSpring(1);
      
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        scale.value = 0;
        opacity.value = 0;
      };
    }
  }, [visible]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn.duration(400)}
          style={styles.container}
        >
          <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
            <CheckCircle size={80} color="#059669" strokeWidth={2} />
          </Animated.View>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    width: '80%',
  },
  iconContainer: {
    marginBottom: 20,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1B10',
    textAlign: 'center',
  },
});

export default SuccessModal;
