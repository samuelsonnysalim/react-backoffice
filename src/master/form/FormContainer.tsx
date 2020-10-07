import React, {
  ReactNode,
  useState,
  createContext,
  useCallback,
  FormEvent,
  useEffect,
  Children,
  ReactElement,
} from "react";
import { Button, Form } from "react-bootstrap";
import { Props as BaseFieldProps } from "./field/BaseField";
import { Datum } from "../../datatable/DataTable";

export interface Fields {
  [propertyName: string]: {
    value: any;
    restValue: any;
  };
}

interface Observers {
  [propertyName: string]: (value: any) => void;
}

interface RestParsers {
  [propertyName: string]: (value: any) => any;
}

interface Props {
  datum: Datum;
  children: ReactNode;
  loadingLabel: string;
  saveButtonLabel: string;
  onSubmit: (restFields: Fields) => void;
}

class FormFactory {
  loadingLabel: string;
  private fields: Fields = {};
  private observers: Observers = {};
  private inboundRestParsers: RestParsers = {};
  private outboundRestParsers: RestParsers = {};

  private composeCustomRestValue<DataType, RestPropertyNameType>(
    restPropertyName: RestPropertyNameType,
    value: DataType,
  ): { [propertyName: string]: any } {
    const result = {};
    Object.keys(value).forEach(key => value && restPropertyName && (result[restPropertyName[key]] = value[key]));
    return result;
  }

  setRestParser<DataType>(
    propertyName: string,
    inboundRestParser: (value: any) => DataType,
    outboundRestParser: (value: DataType) => any,
  ): void {
    if (inboundRestParser) {
      this.inboundRestParsers[propertyName] = inboundRestParser;
    }
    if (outboundRestParser) {
      this.outboundRestParsers[propertyName] = outboundRestParser;
    }
  }

  observe<DataType>(propertyName: string, observer: (value: DataType) => void): void {
    this.observers[propertyName] = observer;
  }

  setField<DataType, RestPropertyNameType>(
    propertyName: string,
    restPropertyName: RestPropertyNameType,
    value: DataType,
  ): void {
    this.fields[propertyName] = {
      value,
      restValue: typeof restPropertyName === "string" ? value : this.composeCustomRestValue(restPropertyName, value),
    };

    if (this.observers[propertyName]) {
      this.observers[propertyName](value);
    }
  }

  getField<DataType>(propertyName: string): DataType {
    return this.fields[propertyName]?.value;
  }

  getFields(): Fields {
    const result = {};
    Object.keys(this.fields).forEach(propertyName => (result[propertyName] = this.fields[propertyName]?.value));
    return result;
  }

  clearFields(): void {
    this.fields = {};
  }

  getRestFields(): Fields {
    let result = {};
    Object.keys(this.fields).forEach(propertyName => {
      if (this.fields[propertyName]?.restValue === this.fields[propertyName]?.value) {
        result[propertyName] = this.outboundRestParsers[propertyName]
          ? this.outboundRestParsers[propertyName](this.fields[propertyName]?.value)
          : this.fields[propertyName]?.value;
      } else {
        let restValue = this.fields[propertyName]?.restValue || {};
        if (this.outboundRestParsers[propertyName]) {
          const parsed = this.outboundRestParsers[propertyName](restValue);
          if (typeof parsed === "object") {
            restValue = parsed;
          }
        }
        result = {
          ...result,
          ...restValue,
        };
      }
    });
    return JSON.parse(JSON.stringify(result));
  }

  getInboundRestParsers<DataType>(propertyName): (value: any) => DataType {
    return this.inboundRestParsers[propertyName];
  }

  getOutboundRestParsers<DataType>(propertyName): (value: DataType) => any {
    return this.outboundRestParsers[propertyName];
  }
}

export const FormFactoryContext = createContext<FormFactory>(null);

const FormContainer = (props: Props): JSX.Element => {
  const [factory] = useState<FormFactory>(new FormFactory());

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      props.onSubmit(factory.getRestFields());
    },
    [factory],
  );

  useEffect(() => {
    if (props.datum) {
      const datum = JSON.parse(JSON.stringify(props.datum));
      Children.forEach(props.children, (field: ReactElement) => {
        const fieldProps = field.props as BaseFieldProps;
        if (fieldProps.showOnForm) {
          if (typeof fieldProps.restPropertyName === "string" && datum[fieldProps.restPropertyName]) {
            factory.setField(fieldProps.propertyName, fieldProps.restPropertyName, datum[fieldProps.restPropertyName]);
          } else if (!fieldProps.restPropertyName && datum[fieldProps.propertyName]) {
            factory.setField(
              fieldProps.propertyName,
              fieldProps.restPropertyName || fieldProps.propertyName,
              datum[fieldProps.propertyName],
            );
          } else if (typeof fieldProps.restPropertyName === "object") {
            const value = {};
            Object.keys(fieldProps.restPropertyName).forEach(
              key => (value[key] = datum[fieldProps.restPropertyName[key]]),
            );
            factory.setField(fieldProps.propertyName, fieldProps.restPropertyName, value);
          }
        }
      });
    } else {
      factory.clearFields();
    }
  }, [props.children, props.datum]);

  useEffect(() => {
    factory.loadingLabel = props.loadingLabel;
  }, [props.loadingLabel]);

  return (
    <FormFactoryContext.Provider value={factory}>
      <Form onSubmit={onSubmit}>
        {props.children}
        <hr />
        <Button variant="primary" size="lg" type="submit" block>
          {props.saveButtonLabel}
        </Button>
      </Form>
    </FormFactoryContext.Provider>
  );
};

const defaultProps: Partial<Props> = {
  onSubmit: () => {},
  saveButtonLabel: "Save",
};
FormContainer.defaultProps = defaultProps;

export default FormContainer;
