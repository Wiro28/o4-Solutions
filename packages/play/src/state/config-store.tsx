
import {
  PlayAddAggregateAction, PlayAddAggregateEventAction,
  PlayAddCommandAction, PlayAddEventPolicyAction,
  PlayAddPageAction, PlayAddPersona, PlayAddQueryAction, PlayAddTypeAction,
  PlayAggregateRegistry, PlayApplyRulesRegistry, PlayChangeTheme, PlayCommandHandlerRegistry,
  PlayCommandRegistry, PlayEventPolicyRegistry, PlayEventRegistry, PlayInformationRegistry,
  PlayInitAction,
  PlayPageRegistry, PlayQueryRegistry, PlayRenameApp, PlayResolverRegistry,
  PlaySchemaDefinitions, PlaySetPersonas, PlayTopLevelPage,
  PlayViewRegistry
} from "@cody-play/state/types";
import {createContext, PropsWithChildren, useEffect, useReducer} from "react";
import {injectCustomApiQuery} from "@frontend/queries/use-api-query";
import {makeLocalApiQuery} from "@cody-play/queries/local-api-query";
import {useUser} from "@frontend/hooks/use-user";
import {currentBoardId} from "@cody-play/infrastructure/utils/current-board-id";
import PlayWelcome from "@cody-play/app/components/core/PlayWelcome";
import {ThemeOptions} from "@mui/material";
import {Persona} from "@app/shared/extensions/personas";
import {types as sharedTypes} from "@app/shared/types";
import {getConfiguredPlayAuthService} from "@cody-play/infrastructure/auth/configured-auth-service";
import _ from "lodash";

export interface CodyPlayConfig {
  appName: string,
  theme: ThemeOptions,
  personas: Persona[],
  pages: PlayPageRegistry,
  views: PlayViewRegistry,
  commands: PlayCommandRegistry,
  commandHandlers: PlayCommandHandlerRegistry,
  aggregates: PlayAggregateRegistry,
  events: PlayEventRegistry,
  eventReducers: PlayApplyRulesRegistry,
  eventPolicies: PlayEventPolicyRegistry,
  queries: PlayQueryRegistry,
  resolvers: PlayResolverRegistry,
  types: PlayInformationRegistry,
  definitions: PlaySchemaDefinitions,
}

const initialPlayConfig: CodyPlayConfig = {
  appName: 'Cody Play',
  theme: {},
  personas: [
    {
      displayName: 'Anyone',
      userId: '0299cda3-a2f7-4e94-9899-e1e37e5fe088',
      email: 'anyone@example.local',
      roles: ['Anyone'],
      avatar: '/assets/account-circle-outline.svg',
      description: 'Anyone represents a standard user of the app without a specific role. This user has access to functionality that is not explicitly restricted.'
    }
  ],
  pages: {
    Dashboard: ({
      service: 'CrmTest',
      commands: [],
      components: ["Core.Welcome"],
      sidebar: {
        label: "Dashboard",
        icon: "ViewDashboard"
      },
      route: "/dashboard",
      topLevel: true,
      breadcrumb: 'Dashboard'
    } as PlayTopLevelPage),
  },
  views: {
    "Core.Welcome": PlayWelcome,
  },
  commands: {
  },
  commandHandlers: {
  },
  aggregates: {
  },
  events: {
  },
  eventReducers: {
  },
  queries: {
  },
  resolvers: {
  },
  types: {
  },
  definitions: {
  },
  eventPolicies: {
  }
}

export const CONFIG_STORE_LOCAL_STORAGE_KEY = 'cody_play_config_';

const syncTypesWithSharedRegistry = (config: CodyPlayConfig): void => {
  // Sync types, so that DataSelect, breadcrumbs, ... can resolve references
  for (const typeName in config.types) {
    sharedTypes[typeName] = config.types[typeName] as any;
  }
}

const storedConfigStr = localStorage.getItem(CONFIG_STORE_LOCAL_STORAGE_KEY + currentBoardId());

const defaultPlayConfig = storedConfigStr ? JSON.parse(storedConfigStr) : initialPlayConfig;

defaultPlayConfig.pages.Dashboard = initialPlayConfig.pages.Dashboard;
defaultPlayConfig.views['Core.Welcome'] = initialPlayConfig.views['Core.Welcome'];

syncTypesWithSharedRegistry(defaultPlayConfig);

console.log(`[PlayConfigStore] Initializing with config: `, defaultPlayConfig);

const configStore = createContext<{config: CodyPlayConfig, dispatch: (a: Action) => void}>({config: defaultPlayConfig, dispatch: (action: Action) => {return;}});

const { Provider } = configStore;

type Action = PlayInitAction | PlayRenameApp | PlayChangeTheme | PlaySetPersonas | PlayAddPersona | PlayAddPageAction | PlayAddCommandAction | PlayAddTypeAction
  | PlayAddQueryAction | PlayAddAggregateAction | PlayAddAggregateEventAction | PlayAddEventPolicyAction;

type AfterDispatchListener = (state: CodyPlayConfig) => void;

const afterDispatchListeners: AfterDispatchListener[] = [];

const addAfterDispatchListener = (listener: AfterDispatchListener): void => {
  afterDispatchListeners.push(listener);
}

const clearAfterDispatchListener = (): void => {
  afterDispatchListeners.pop();
}

let currentDispatch: any;

const PlayConfigProvider = (props: PropsWithChildren) => {
  const [user, ] = useUser();
  const [config, dispatch] = useReducer((config: CodyPlayConfig, action: Action): CodyPlayConfig => {
    console.log(`[PlayConfigStore] Going to apply action: `, action);
    switch (action.type) {
      case "INIT":
        const newConfig = _.isEmpty(action.payload)? initialPlayConfig : { ...action.payload };
        newConfig.pages.Dashboard = initialPlayConfig.pages.Dashboard;
        newConfig.views["Core.Welcome"] = initialPlayConfig.views["Core.Welcome"];
        syncTypesWithSharedRegistry(newConfig);
        return newConfig;
      case "RENAME_APP":
        return {...config, appName: action.name};
      case "CHANGE_THEME":
        return {...config, theme: action.theme};
      case "SET_PERSONAS":
        // Sync Auth Service
        getConfiguredPlayAuthService(action.personas, currentDispatch);
        return {...config, personas: action.personas};
      case "ADD_PERSONA":
        for (const existingPersona of config.personas) {
          if(existingPersona.userId === action.persona.userId) {
            return config
          }
        }

        const updatedPersonas =  [...config.personas, action.persona];
        // Sync Auth Service
        getConfiguredPlayAuthService(updatedPersonas, currentDispatch);
        return {...config, personas: updatedPersonas};
      case "ADD_PAGE":
        config.pages = {...config.pages};
        config.pages[action.name] = action.page;
        return {...config};
      case "ADD_COMMAND":
        config.commands = {...config.commands};
        config.commands[action.name] = action.command;
        return {...config};
      case "ADD_TYPE":
        config.types = {...config.types};
        config.definitions = {...config.definitions};
        config.types[action.name] = action.information;
        config.definitions[action.definition.definitionId] = action.definition.schema;

        syncTypesWithSharedRegistry(config);
        return {...config};
      case "ADD_QUERY":
        config.queries = {...config.queries};
        config.resolvers = {...config.resolvers};
        config.views = {...config.views};
        config.queries[action.name] = action.query;
        config.resolvers[action.name] = action.resolver;
        config.views[action.query.desc.returnType] = {information: action.query.desc.returnType};
        return {...config};
      case "ADD_AGGREGATE":
        config.aggregates = {...config.aggregates};
        config.commandHandlers = {...config.commandHandlers};
        config.aggregates[action.name] = action.aggregate;
        config.commandHandlers[action.command] = action.businessRules;
        return {...config};
      case "ADD_AGGREGATE_EVENT":
        config.events = {...config.events};
        config.eventReducers = {...config.eventReducers};
        config.eventReducers[action.aggregate] = {...config.eventReducers[action.aggregate]};
        config.events[action.name] = action.event;
        config.eventReducers[action.aggregate][action.name] = action.reducer;
        return {...config};
      case "ADD_EVENT_POLICY":
        config.eventPolicies = {...config.eventPolicies};
        config.eventPolicies[action.event] = {...config.eventPolicies[action.event]};
        config.eventPolicies[action.event][action.name] = action.desc;
        return {...config};
      default:
        return config;
    }
  }, defaultPlayConfig);

  useEffect(() => {
    console.log("[PlayConfigStore] trigger after dispatch: ", config);
    afterDispatchListeners.forEach(l => l(config));
  }, [config]);

  useEffect(() => {
    getConfiguredPlayAuthService(config.personas, dispatch);
  })

  injectCustomApiQuery(makeLocalApiQuery(config, user));

  currentDispatch = dispatch;

  return <Provider value={{ config, dispatch }}>{props.children}</Provider>;
}

export {configStore, PlayConfigProvider, Action, addAfterDispatchListener, clearAfterDispatchListener};