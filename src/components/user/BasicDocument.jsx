import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Image,
    Font
  } from "@react-pdf/renderer";
import { Spinner } from "evergreen-ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { endpoints } from "../../API";
import * as myConsts from "../fileConsts";
import Html from 'react-pdf-html';

    // Register Font
    Font.register({
        family: "Roboto",
        src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
    });

  // Create styles
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "white",
      color: "black",
    },
    container: {
        flex: 1,
        marginHorizontal: 40,
        marginVertical: 20,
        fontFamily: "Roboto"
    },
    sectionHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    sectionContent: {
        flex: 9,
    },
    headInformation: {
        textAlign: "left",
        fontSize: 8,

    },
    header: {
        textAlign: "center",

    },
    section: {
      margin: 10,
      padding: 10,
    },
    viewer: {
      width: window.innerWidth, //the pdf viewer will take up all of the width and height
      height: window.innerHeight,
    },
    flex_center: {
        flex: 1,
        flexDirection: 'row'
    },
    align_center: {
        alignItems: 'center'
    },
    title_container: {
        flex: 1,
    },
    contentHtml: {
        flex: 9,
    },
    title: {
        fontSize: 25,
        textAlign: 'left',
        fontWeight: 'extrabold'
    },
  });

  
  // Create Document Component
  function BasicDocument(props) {
    const magazineId = localStorage.getItem("magazineId");
    const journal_url = localStorage.getItem("journal_url");
    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(endpoints['journal-info'](journalId)).then(res => {
            setJournal(res.data);
            setLoading(false);
        }
        ).catch(err => console.log(err));
    }, [journalId]);

    if (loading === true) {
        return (
            <>
                <div className='m-auto min-h-screen'>
                    <div className='justify-center'>
                        <Spinner size='xl' />
                        <span className='pl-2'>Loading...</span>
                    </div>
                </div>
            </>
        )
    } else {
            return (
            <PDFViewer style={styles.viewer}>
                {/* Start of the document*/}
                <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page}>
                    <View style={styles.container}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.headInformation}>
                                <Text>The Open University</Text>
                                <Text>Scientific Journal</Text>
                                <Text>Magazine number: {magazineId}</Text>
                                <Text>{journal_url}</Text>
                            </View>
                            {/* image logo - justify center */}
                            <View style={{width: 50}}>
                                <Image src={myConsts.LOGO_URL} ></Image>
                            </View>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.title_container}>
                                <Text style={{fontSize: 15, fontWeight: 'bold'}}>{journal.type}</Text>
                                <Text style={styles.title}>{journal.title}</Text>
                            </View>
                            <View style={styles.contentHtml}>
                                <Text>Authors: {journal.listAuthor}</Text>
                                <Text>Keyword: {journal.listKeyword}</Text>
                                <View style={{marginHorizontal: 20}}>
                                    <Html>{journal.contentHtml}</Html>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                </Document>
            </PDFViewer>
    );}

  }
  export default BasicDocument;