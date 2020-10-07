import React from "react";
import {
  TextField,
  MultilineTextField,
  NumberField,
  DateField,
  RadioField,
  RemoteCheckField,
  SelectField,
  MultipleSelectField,
  RangeNumberField,
  RangeDateField,
} from "react-backoffice";
import MasterContainer, { Query } from "../components/MasterContainer";

interface Props {
  query: Query;
}

const Index = (props: Props): JSX.Element => (
  <MasterContainer
    query={props.query}
    title="User"
    dataFetchingResourcePath="/users"
    newInstanceFetchingResourcePath="/users"
    updateInstanceFetchingResourcePath="/users/:id"
    deleteInstanceFetchingResourcePath="/users/:id"
  >
    <TextField label="ID" propertyName="id" showOnForm={false} />
    <TextField label="First Name" propertyName="firstName" inputPlaceholder="Input First Name" />
    <TextField label="Last Name" propertyName="lastName" inputPlaceholder="Input Last Name" />
    <TextField
      label="Phone No"
      propertyName="phoneNo"
      inputPlaceholder="Input Phone No"
      type="tel"
      showOnDataTable={false}
    />
    <MultilineTextField
      label="Address"
      propertyName="address"
      inputPlaceholder="Input Address"
      showOnDataTable={false}
      useRichtext
    />
    <NumberField label="Age" propertyName="age" inputPlaceholder="Input Age" />
    <DateField label="Date of Birth" propertyName="dob" inputPlaceholder="Input Date of Birth" />
    <RadioField
      label="Gender"
      propertyName="gender"
      options={[
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ]}
    />
    {/* <CheckField
      label="Education"
      propertyName="education"
      showOnDataTable={false}
      options={[
        { value: "tk", label: "Kindergarten" },
        { value: "sd", label: "Elementary School" },
        { value: "smp", label: "Junior High School" },
        { value: "sma", label: "Senior High School" },
        { value: "s1", label: "Under Graduate" },
        { value: "s2", label: "Graduate" },
        { value: "s3", label: "Post Graduate" },
      ]}
      // customOutboundRestParser={value => value?.join(",")}
    /> */}
    <RemoteCheckField
      label="Education"
      propertyName="education"
      showOnDataTable={false}
      optionsResourceUrl={`${process.env.API_BASE_URL}/educations`}
      optionValuePropertyName="id"
      optionLabelPropertyName="name"
    />
    <SelectField
      label="Job"
      propertyName="job"
      inputPlaceholder="Select a Job"
      options={[
        { value: "developer", label: "Developer" },
        { value: "waiter", label: "Waiter" },
        { value: "security", label: "Security" },
      ]}
    />
    <MultipleSelectField
      label="Industry"
      propertyName="industry"
      inputPlaceholder="Select Industries"
      showOnDataTable={false}
      options={[
        { value: "technology", label: "Technology" },
        { value: "hospitality", label: "Hospitality" },
        { value: "transportation", label: "Transportation" },
      ]}
    />
    <RangeNumberField
      label="Preferred Salary"
      propertyName="salary"
      restPropertyName={{ min: "minSalary", max: "maxSalary" }}
      inputPlaceholder={{ min: "Min Salary", max: "Max Salary" }}
    />
    <RangeDateField
      label="Active Date"
      propertyName="activeDate"
      restPropertyName={{ min: "fromActiveDate", max: "toActiveDate" }}
      inputPlaceholder={{ min: "From", max: "To" }}
    />
  </MasterContainer>
);

Index.getInitialProps = ({ query }) => ({ query });

export default Index;
