<h1 align="center">
     cotect
    <br>
</h1>

<p align="center">
    <strong>Crowd-sourced COVID-19 reporting and surveillance system.</strong>
</p>

## Problem Statement

- **Hard to get tested:** Germany has a theoretical capacity of 12k tests a day, but logistical challenges and limits on medical personal will make it unlikely to have anyone with flu-like symptoms tested in a timely manner. Based on the current scientific state, fast a reliable detection capability is one of the best ways to slow down the virus infections.
- **Missing data collection:** Within Germany, there is no easy way for individuals to report flu-like symptoms and related information to allow meaningful statistical inference on undetected infection chains. Furthermore, centralized data collection of official hotlines or doctor's offices is very limited or non-existent.
- **Hard to keep contacts informed:** In case of a suspected infection, it's emotionally stressful to reach out to family and friends to provide this potentially valuable information. For other contacts, you might not even be able to inform them. An anonymized way of reporting symptoms and meta-information would allow anybody to keep potential contacts informed.
- **Unable to make data-informed decisions:** If Covid-19 cannot be contained, we will most likely have to deal with it for several months. Of course, a longterm lockdown can not be sustained and public life will go on. A tool that can provide "real-time" predictions about the risk of visiting certain places can be invaluable for many people, especially for high-risk groups.

## Solution

Cotect allows anyone to anonymously report their flu-symptoms with relevant meta-information such as visited places or events. By analyzing statistical correlations in the collected data, users that have will get personal risk assessments (e.g., likelihood of Covid-19 infection) based on their reports. Users, especially in the high-risk group, will also be able to get real-time information on the risk of visiting selected places (e.g., city, workplace, school). The full anonymized dataset will be made accessible to research facilities and public institutions for discovering unknown infection chains and assist with data-informed decisions on closing places or canceling events.

[MOCKUP]

The initial goal at the start of the project will be to help with containment and slow-down of infections. At a later stage of the project, we will put the main focus on helping to protect the high-risk groups (elderly, people with pre-existing conditions). 

[CURVE]

### Architecture

[ARCHITECTURE]

The initial selection of technologies includes:

- React Native for cross-platform app development (Android & iOS).
- Neo4j for storing the case reports in a graph format.
- Docker and Kubernetes for service deployment.
- Firebase for SMS authentication and crash reporting.

The main aspects of this selection of technologies are the speed of development, simplicity, and scalability. We are still in evaluation of which cloud platform we want to use (GCP, AWS, Azure). However, since Firebase is part of GCP, this might be the best choice for now.

### Authentication

We will use only a phone number based authentication (similar to WhatsApp) to enable a certain level of anonymity while still keeping misuse and spam low (further explained in the challenges section).

### Case Report - Information

All metadata are strictly optional. The user can decide which level of information he is willing to provide.

- Current location (city-level)
- Basic demographic metadata: age & gender
- Selection of symptoms from a collection of flu/corona-symptoms (fever, cough, headache, ...)
    - enrich with additional metadata based on selected symptoms (e.g. fever → body temperature)
- Places visited during the last 14 days (cities, workplaces, cafes, church, clubs, schools,  ...) + date of visit.
- *Events visited during the last 14 days (probably not necessary since any event is mostly bound to a specific location/place).*
- Test result for coronavirus, in case a test was performed.
- People you had at-least 15 minutes contact during the last 14 days + timestamp of last contact. Select based on phone contacts → match via phone number.

After reporting the initial case information, the user can always update this information as well. A case report update will enable the user to provide changes in symptoms or additional visited places / contacted persons.

### Assessment Report

*TBD*

### Further Improvements

- Integrate regular push notifications to remind users to update their case data.
- Integrate push notifications
- Integrate publicly available data or internal data from public institutions to enrich our dataset.
- Provide integration options to public institutions to enable efficient data collection with hotlines.
- Evaluate optional Bluetooth or GPS tracking for automated contact tracing.
- Incorporate newest Study results on COVID-19 (e.g.,  symptoms,  ways of infection, risk-factors)

### Open Questions

- Store phone numbers in database or only hashes/unique-ids?

## Challenges

- **Scalability:** The app will need to have a high number of users to be useful and provide high-quality statistical assessments. This puts on technical challenges (needs to scale to thousands - maybe millions - of users) as well as challenges on the distribution (how to reach people? how to grow the app?).
- **Statistical Quality:** At the moment, we do not have any conclusive information on what saturation (count of reports) we need to draw any statistical conclusion for risk assessments. This will be an active workstream to collect scientific evidence. Furthermore, we will need to try various data science and machine learning methods to build up a stable analysis pipeline.
- **Data Privacy:** People in Germany are generally quite concerned about data collection, especially if it involves medical data. We hope that a transparent project organization, open-source development, a certain level of anonymity, a well-defined data strategy, and a clear message never to have any commercial intent will provide a high level of trust. Furthermore, in times of crisis, people might prioritize the positive aspects that can be achieved by having a centralized data collection over their concerns on data privacy.
- **Misuse:** It might turn out to be a challenge to keep the data as clean and trustworthy as possible. People might try misuse the app and report wrong or misleading information, which in turn will screw up any statistical inference. Phone-number based authentication might keep the number of under maligned accounts under control.
- **Urgency & Speed:** Because of the quickly evolving situation, the project requires rapid development, pragmatic decisions, and out-of-the-box thinking while still keeping the quality, security, and scalability of the technology. The project needs to be organized in a way additional members can be added at any moment to speed up development.

## Organization & Execution

- Driven by SAP developers but fully open-source and open for public contributions. **
- This project will have zero commercial intent. The software will be fully open-source. Collected data will be accessible by public institutions and research facilities. Data will be deleted on request or if the project has fulfilled its goal.
- We plan to roll out the app city-by-city, depending on which city is facing the most significant issues. Our first focus will be cities within Germany and other European countries.
- Pragmatic and agile decisions with focus on building something useful.
- This project will run in stealth mode (no marketing or spotlight) with full focus on developing and rolling out scalable and stable software in the fastest possible way.
- We will slow down or stop this project in case COVID-19 can be contained or we get indications that the situation will not require this kind of software.

