import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logo from '../../../../../assets/images/Foxxum_LogoPrimaryLight.png';
import brother from '../../../../../assets/fonts/Brother-1816-Book.ttf';
import bold from '../../../../../assets/fonts/Brother-1816-Bold.ttf';
import { getDevices } from '../helpers/variables';

Font.register({ family: 'Brother', src: brother, fontStyle: 'normal', fontWeight: 'normal' });
Font.register({ family: 'BroBold', src: bold, fontStyle: 'normal', fontWeight: 'normal' });

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Brother',
    paddingTop: 80,
    paddingBottom: 70,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 20,
    margin: '1% 0',
  },
  image: {
    position: 'absolute',
    top: 15,
    right: 50,
    height: 50,
    width: 80,
  },
  subtitle: {
    fontSize: 15,
    margin: '1% 0%',
  },
  section: {
    flexDirection: 'row',
    fontSize: 10,
  },
  itemSection: {
    fontSize: 10,
    fontFamily: 'BroBold',
    maxWidth: '60%',
    marginTop: 5,
  },
  itemResult: {
    fontSize: 10,
    marginLeft: 5,
    marginTop: 5,
    width: '80%',
  },
  itemComment: {
    fontSize: 8,
    marginLeft: 5,
    width: '60%',
  },
  line: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderTopWidth: 1,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: '8%',
    textAlign: 'center',
    flexDirection: 'row',
    color: 'grey',
    width: '95%',
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
    fontSize: 10,
    width: '10%',
  },
  hCell2: {
    padding: 5,
    fontSize: 10,
    width: '60%',
  },
  hCell3: {
    padding: 5,
    fontSize: 10,
    width: '20%',
    height: 'auto',
  },
  hCell4: {
    padding: 5,
    fontSize: 10,
    width: '10%',
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
    width: '60%',
  },
  cell3: {
    padding: '5 0 5 5',
    fontSize: 10,
    width: '20%',
    height: 'auto',
  },
  cell4: {
    padding: '5 0 5 5',
    fontSize: 10,
    width: '10%',
  },
});

export default function IssuesReportPDF(props) {
  const { app, issues, date } = props;
  const DocName = `Foxxum_${app.alias}-IssuesReport_${date.year}${date.month}${date.day}.pdf`;
  const { url } = app.appUrls[app.appUrls.length - 1];
  const devices = getDevices();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.image} source={logo} fixed />

        <Text style={styles.title}>Issues Report - {app.alias}</Text>
        <Text style={styles.subtitle}>App Information</Text>

        <View style={styles.section}>
          <Text style={styles.itemSection}>Name</Text>
          <Text style={styles.itemResult}>{app.name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.itemSection}>URL</Text>
          <Text style={styles.itemResult}>{url}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.itemSection}>Additional Information</Text>
          <Text style={styles.itemResult}>{app.additionalInformation}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.itemSection}>Number of Issues</Text>
          <Text style={styles.itemResult}>{issues.length}</Text>
        </View>

        <Text>{`\n`}</Text>

        <Text style={styles.subtitle}>Issues</Text>
        {issues.map((issue, index) => {
          return (
            <View style={styles.line}>
              <Text>{`\n`}</Text>
              <View style={styles.section}>
                <Text style={styles.itemSection}>ID</Text>
                <Text style={styles.itemResult}>{index}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.itemSection}>Name</Text>
                <Text style={styles.itemResult}>{issue.name}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.itemSection}>Category</Text>
                <Text style={styles.itemResult}>{issue.category}</Text>
              </View>

              <Text style={styles.itemSection}>Description</Text>
              <Text style={styles.itemResult}>{issue.description}</Text>

              <View style={styles.section}>
                <Text style={styles.itemSection}>Tested by</Text>
                <Text style={styles.itemResult}>{issue.testedBy}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.itemSection}>Severity</Text>
                <Text style={styles.itemResult}>{issue.severity}</Text>
              </View>

              <Text style={styles.itemSection}>Pre-requisites</Text>
              {issue.preRequisites.map((pre) => {
                return <Text style={styles.itemResult}>- {pre}</Text>;
              })}

              <Text style={styles.itemSection}>Steps</Text>
              {issue.steps.map((step) => {
                return <Text style={styles.itemResult}>- {step}</Text>;
              })}

              <View style={styles.section}>
                <Text style={styles.itemSection}>Expected Result</Text>
                <Text style={styles.itemResult}>{issue.expectedResult}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.itemSection}>Current Result</Text>
                <Text style={styles.itemResult}>{issue.currentResult}</Text>
              </View>

              <Text style={styles.itemSection}>Technical Feedback</Text>
              <Text style={styles.itemResult}>{issue.technicalFeedback}</Text>

              <View style={styles.section}>
                <Text style={styles.itemSection}>Addition Information</Text>
                <Text style={styles.itemResult}>{issue.additionalInformation}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.itemSection}>URL</Text>
                <Text style={styles.itemResult}>{issue.url}</Text>
              </View>

              <Text style={styles.itemSection}>Devices</Text>
              {issue.devices.map((device) => {
                return <Text style={styles.itemResult}>- {`${device.deviceNameShort}`}</Text>;
              })}

              <View style={styles.section}>
                <Text style={styles.itemSection}>Reproducibility Rate</Text>
                <Text style={styles.itemResult}>{issue.reproducibilityRate}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.itemSection}>Is Solved</Text>
                <Text style={styles.itemResult}>{issue.isSolved ? 'Yes' : 'No'}</Text>
              </View>
              <Text>{`\n`}</Text>
            </View>
          );
        })}

        <Text style={styles.subtitle}>Summary</Text>
        <View style={styles.table}>
          <View style={styles.headrow}>
            <Text style={styles.hCell1}>Code</Text>
            <Text style={styles.hCell2}>Device</Text>
            <Text style={styles.hCell3}>Issues</Text>
            <Text style={styles.hCell4}>Status</Text>
          </View>
          {devices
            ? // eslint-disable-next-line array-callback-return
              devices.map((device, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <View key={index} style={styles.trow} wrap={false}>
                    <Text style={styles.cell1}>{device.code}</Text>
                    <Text style={styles.cell2}>{device.name}</Text>
                    <Text style={styles.cell3}>{device.issueIds.join(', ')}</Text>
                    <Text style={styles.cell4}>{device.status}</Text>
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
          <Text style={styles.fcell2}>{DocName}</Text>
          <Text style={styles.fcell3} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </View>
      </Page>
    </Document>
  );
}
