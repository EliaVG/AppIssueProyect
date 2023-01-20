import React from 'react';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from '../../../../../assets/images/Foxxum_LogoPrimaryLight.png';
import brother from '../../../../../assets/fonts/Brother-1816-Book.ttf';

Font.register({ family: 'Brother', src: brother, fontStyle: 'normal', fontWeight: 'normal' });
// ToDo: It should be a component
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Brother',
    paddingTop: 80,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 20,
    margin: '5% 0 5% 5%',
  },
  image: {
    position: 'absolute',
    top: 15,
    right: 50,
    height: 50,
    width: 80,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 0,
  },
  headrow: {
    flexDirection: 'row',
    backgroundColor: '#ababab',
    borderWidth: 1,
  },
  hCell1: {
    padding: 5,
    fontSize: 15,
    width: '10%',
  },
  hCell2: {
    padding: 5,
    fontSize: 15,
    width: '20%',
  },
  hCell3: {
    padding: 5,
    fontSize: 15,
    width: '70%',
    height: 'auto',
  },
  trow: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: -1,
  },
  cell1: {
    padding: '5 0 5 5',
    fontSize: 10,
    width: '10%',
  },
  cell2: {
    padding: '5 0 5 5',
    fontSize: 10,
    width: '20%',
  },
  cell3: {
    padding: '5 0 5 5',
    fontSize: 10,
    width: '70%',
    height: 'auto',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    width: '95%',
    left: '8%',
    textAlign: 'center',
    flexDirection: 'row',
    color: 'grey',
  },
});

export default function UserAgentPDF(props) {
  const { devices, date, appName } = props;
  const DocName = `Foxxum_${appName}-UserAgents_${date}.pdf`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.image} source={logo} fixed />
        <Text style={styles.title}>Foxxum User Agents</Text>
        <View style={styles.table}>
          <View style={styles.headrow}>
            <Text style={styles.hCell1}>Code</Text>
            <Text style={styles.hCell2}>Device</Text>
            <Text style={styles.hCell3}>User Agent</Text>
          </View>
          {devices
            ? // eslint-disable-next-line array-callback-return
              devices.map((device, index) => {
                if (device.navigatorSpecs != null) {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <View key={index} style={styles.trow} wrap={false}>
                      <Text style={styles.cell1}>{device.appCodeManager}</Text>
                      <Text style={styles.cell2}>{device.deviceNameShort}</Text>
                      <Text style={styles.cell3}>{device.navigatorSpecs.userAgent}</Text>
                    </View>
                  );
                }
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <View key={index} style={styles.trow} wrap={false}>
                    <Text style={styles.cell1}>{device.appCodeManager}</Text>
                    <Text style={styles.cell2}>{device.deviceNameShort}</Text>
                    <Text style={styles.cell3}> </Text>
                  </View>
                );
              })
            : ''}
        </View>
        <View style={styles.footer} fixed>
          <View>
            <Text>Copyright Foxxum GmbH,</Text>
            <Text>protected by NDA</Text>
          </View>
          <Text>{DocName}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </View>
      </Page>
    </Document>
  );
}
