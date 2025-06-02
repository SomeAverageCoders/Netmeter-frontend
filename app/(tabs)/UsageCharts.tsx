import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const UsageChart = () => {
  const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYWEyMzJkYjItN2E3OC00NDE0LWE1MjktMzNkYjkxMjRjYmE3LyIsImlhdCI6MTc0ODg3MjY5NSwibmJmIjoxNzQ4ODcyNjk1LCJleHAiOjE3NDg4NzY1OTUsImFpbyI6ImsyUmdZRGhpNnV6NTF0bnBlTktDaFFWMlpYYjVBQT09IiwiYXBwaWQiOiI5NmFkOGUyYy1lYjQ1LTRiMGEtYmI0Ni1iZDFmNDA5ODYxZmYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hYTIzMmRiMi03YTc4LTQ0MTQtYTUyOS0zM2RiOTEyNGNiYTcvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI4NTI3ZmZkYy1kMWUzLTQ3YTItYTVhOC00ZjVlYWExNWU0NmEiLCJyaCI6IjEuQVZVQXNpMGpxbmg2RkVTbEtUUGJrU1RMcHdrQUFBQUFBQUFBd0FBQUFBQUFBQUNfQUFCVkFBLiIsInN1YiI6Ijg1MjdmZmRjLWQxZTMtNDdhMi1hNWE4LTRmNWVhYTE1ZTQ2YSIsInRpZCI6ImFhMjMyZGIyLTdhNzgtNDQxNC1hNTI5LTMzZGI5MTI0Y2JhNyIsInV0aSI6IlFsU2pBVUgxV0UtRlVOUE15U0p2QUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfZnRkIjoiaWZDMzZoY1ZnTEljUWxZNXB6SVZwdjZZV0xGdVFlMFFGTXFteHBIZG5Ub0JhMjl5WldGalpXNTBjbUZzTFdSemJYTSIsInhtc19pZHJlbCI6IjIyIDciLCJ4bXNfcmQiOiIwLjQyTGxZQkppREJVUzRXQVhFbmdpY29YdDFSRWZwNDc2eUkybm5IalRnS0tjUWdJZTV4Z19iWC1jNWI1OUhWLWFQM3YwT2FBb2g1QUFKd01FSElEU0FBIn0.QrQGCtYtbuivZb4MD5K9fFRJ86XXk4kKbYPhZFZRnukUsPkaNcJ3-KWmBNSdZuuoUb6VR012lx3qK7iNXLR9Wp-JESdnQKFR-tTUXWIJWelYElKMl1Pwkjd4faiYbcvc2xbIrW5PYXh0RxmLKaKRXGdqXeTU77wJFplCniSvzHmOrXf3vwT20UxULx4iMa0UlhZmmwgXQvhmhE4yCJZVkpNZyAhQcz0gMm_rPKIlgKER1CNL_pD6TtzdCm2UpmEsrvv6C9zYtiOHKeBlCqi2J-Aihz7Gk_NRmXQulfRdTtTUoyDgOjZRmPZGLWCqgUH3UZIvcc2caeOvxRqhXxd5Qw'; // ⚠️ Must be refreshed every 1 hour
  const embedUrl =
    'https://app.powerbi.com/reportEmbed?reportId=03dcc690-947c-483f-87b2-a724edfcad91&groupId=8de4c42d-4d1e-4823-a3ed-2c29f99fdbe4&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d';
    
  const reportId = '03dcc690-947c-483f-87b2-a724edfcad91';

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.powerbi.com/libs/powerbi-client/2.21.0/powerbi.js"></script>
      <style>
        html, body, #reportContainer { margin: 0; padding: 0; height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="reportContainer"></div>
      <script>
        const models = window['powerbi-client'].models;
        const config = {
          type: 'report',
          tokenType: models.TokenType.Embed,
          accessToken: "${accessToken}",
          embedUrl: "${embedUrl}",
          id: "${reportId}",
          settings: {
            background: models.BackgroundType.Transparent,
            panes: {
              filters: { visible: false }
            }
          }
        };
        powerbi.embed(document.getElementById('reportContainer'), config);
      </script>
    </body>
  </html>
`;


  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState
        automaticallyAdjustContentInsets={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UsageChart;
