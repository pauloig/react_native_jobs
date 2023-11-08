import {Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useCallback, useState} from 'react';

import { Company, JobAbout, JobFooter, JobTabs, ScreenHeaderBtn, Specifics } from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";
import { Switch } from "react-native-gesture-handler";

const tabs = ["About", "Qualifications","Responsibilities"];

const jobDetails = ({job}) => {

    const params = useSearchParams();
    const router = useRouter();

    /*const isLoading = false;
    const error = '';

    data = [{employer_name:"Dice",
    employer_logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKlgydP7sElaJC9qPrtNHwBhyTMHYgii1RPWsy&s=0",
    employer_website:null,
    employer_company_type:"Information",
    job_publisher:"LinkedIn",
    job_id:"8yv3oA_2-UYAAAAAAAAAAA==",
    job_employment_type:"CONTRACTOR",
    job_title:"Web Developer - 6-month Contract - Houston Hybrid",
    job_apply_link:"https://www.linkedin.com/jobs/view/web-developer-6-month-contract-houston-hybrid-at-dice-3624857671",
    job_apply_is_direct:false,
    job_apply_quality_score:0.5805,
    job_description:"An established energy client of mine is looking for an experienced Web Developer to join their team on an initial 6-month contract. Starting 6/5, you will be working in an agile team to help develop a new set of web applications for their own system and sub vendors. This role is hybrid and you will be required to go in to the office 3 days p/w. Full-Stack Web Developer 6-month contract (likely extension) Houston - Hybrid working W2 - $70 - $75 p/h C2C - $80 - $90 p/h Starting 06/05 Technical requirements; JavaScript, (React OR Angular OR Vue), Node, HTML, CSSS, API (NO EMPLOYERS OR RECRUTIERS) Oscar Associates Limited (US) is acting as an Employment Business in relation to this vacancy. Web Developer - 6-month Contract - Houston Hybrid",
    job_is_remote:true, 
    job_posted_at_timestamp:1685653019,
    job_posted_at_datetime_utc:"2023-06-01T20:56:59.000Z",
    job_city:"Houston",
    job_state:"TX",
    job_country:"US",
    job_latitude:29.760427,
    job_longitude:-95.369804,
    job_benefits:null,
    job_google_link:"https://www.google.com/search?gl=us&hl=en&rciv=jb&q=web+developer+in+texas+usa&start=0&ibp=htl;jobs#fpstate=tldetail&htivrt=jobs&htiq=web+developer+in+texas+usa&htidocid=8yv3oA_2-UYAAAAAAAAAAA%3D%3D",
    job_offer_expiration_datetime_utc:"2023-07-01T20:56:59.000Z",
    job_offer_expiration_timestamp:1688245019,
    job_required_experience:{},
    job_required_skills:null,
    job_required_education:{},
    job_experience_in_place_of_education:false,
    job_min_salary:null,
    job_max_salary:null,
    job_salary_currency:null,
    job_salary_period:null,
    job_highlights:{
        qualifications: [
        "Python, React, Linux, Unix, API",
        "Strong development experience using Python, REST API Service",
        "Database development skills, experience with Object-oriented and Relational databases - SQL Server/Oracle/Sybase",
        "Experience developing software using Agile methodology",
        "Knowledge of JIRA tools and Continuous Integration capabilities",
        "Hands on experience in writing unit and UI integration test cases",
    ],
    Responsibilities: [
        "Do it the Best",
        "Develop APIs",
        "Database development skills, experience with Object-oriented and Relational databases - SQL Server/Oracle/Sybase",
        "Experience developing software using Agile methodology",
        "Knowledge of JIRA tools and Continuous Integration capabilities",
        "Hands on experience in writing unit and UI integration test cases",
    ]},
    job_job_title:null,
    job_posting_language:"en",
    job_onet_soc:"15113400",
    job_onet_job_zone:"3",
    job_naics_code:"519130",
    job_naics_name:"Internet Publishing and Broadcasting and Web Search Portals"}];
*/

    const {data, isLoading, error, refetch} = useFetch('job-details', {job_id: params.id,});

    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch();
        setRefreshing(false);
    },[]) 

    const displayTabContent = () =>{
        switch (activeTab) {
            case "Qualifications":
                return <Specifics
                    title="Qualifications"
                    points={data[0].job_highlights?.qualifications ?? ['N/A']}
                />
                break;
            case "About":
                return <JobAbout
                    title="About"
                    info={data[0].job_description ?? "No data Provided"}
                />
                break;
            case "Responsibilities":
                return <Specifics
                    title="Responsibilities"
                    points={data[0].job_highlights?.Responsibilities ?? ['N/A']}
                />
                break;
            default:
                break;
        }
    }

    return (
        <SafeAreaView style ={{ flex:1 , backgroundColor: COLORS.lightWhite}}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn iconUrl={icons.left} 
                        dimension = "60%"
                        handlePress={()=> router.back()}
                    />
                    ),
                    headerRight: () => (
                        <ScreenHeaderBtn iconUrl={icons.share} dimension = "100%"/>
                    ),
                    headerTitle: "",
                }}
            />

            <>
                <ScrollView showsVerticalScrollIndicator={false} 
                    RefreshControl= {
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}>
                        </RefreshControl>
                    }
                >
                    { isLoading ? (
                        <ActivityIndicator size="Large" color ={COLORS.primary} />
                    ) : error ? (
                        <Text>Something Went Wrong!</Text>
                    ) : data.length === 0 ? (
                        <Text>No Data</Text>
                    ) :  (
                        <View style = {{padding: SIZES.medium, paddinBottom: 100}}>
                            <Company
                                companyLogo = {data[0].employer_logo}
                                jobTitle = {data[0].job_title}
                                companyName = {data[0].employer_name}
                                Location = {data[0].job_country}
                            />
                            <JobTabs
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />

                            {displayTabContent()}

                        </View>
                    )                 
                        
                    }
                </ScrollView>

                <JobFooter
                    url={data[0]?.job_google_link ?? 'https://careers.google.com/jobs/results'}
                />
            </>
        </SafeAreaView>
    )
}

export default jobDetails