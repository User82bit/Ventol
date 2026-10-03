import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  streamUrl: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const CameraView: React.FC<Props> = ({ streamUrl, containerStyle }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Câmera indisponível</Text>
        </View>
      ) : (
        <>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Carregando câmera...</Text>
            </View>
          )}
          {Platform.OS === 'web' ? (
            <Image
              source={{ uri: streamUrl }}
              style={styles.webview}
              resizeMode="cover"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => { setError(true); setLoading(false); }}
            />
          ) : (
            <WebView
              source={{ uri: streamUrl }}
              style={styles.webview}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => { setError(true); setLoading(false); }}
              scalesPageToFit={true}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 150,
    backgroundColor: '#000000',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    zIndex: 1,
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  errorText: {
    color: '#f87171',
    fontWeight: 'bold',
  },
});
