import * as c from './ActionTypes';

export const getPropertiesSuccess = (properties) => ({
  type: c.GET_PROPERTIES_SUCCESS,
  properties
});

export const getListingSuccess = (listings) => ({
  type: c.GET_LISTING_SUCCESS,
  listings
});

export const getListingAvailData = (listingsAvail) => ({
  type: c.GET_LISTING_AVAIL_DATA,
  listingsAvail
});

export const getDataSuccess = (properties) => ({
  type: c.GET_DATA_SUCCESS,
  properties
});

export const getDataPush = () => ({
  type: c.GET_DATA_PUSH
});

export const getWeatherSuccess = (forecast) => ({
  type: c.GET_WEATHER_SUCCESS,
  forecast
});

export const getWeatherLoaded = (weatherForecast) => ({
  type: c.GET_WEATHER_LOADED,
  weatherForecast
})

export const getEventsSuccess = (eventsList) => ({
  type: c.GET_EVENTS_SUCCESS,
  eventsList
});

export const getEventsLoaded = (allEvents) => ({
  type: c.GET_EVENTS_LOADED,
  allEvents
})

export const getHolidaySuccess = (holidayList) => ({
  type: c.GET_HOLIDAY_SUCCESS,
  holidayList
});

export const getHolidaysLoaded = (holidays) => ({
  type: c.GET_HOLIDAYS_LOADED,
  holidays
});

export const getFetchFailure = (error) => ({
  type: c.GET_FETCH_FAILURE,
  error
});

export const getFormVisible = () => ({
  type: c.GET_FORM_VISIBLE
});

export const getCompleteInvoice = (values) => ({
  type: c.GET_COMPLETE_INVOICE,
  values
});

export const getCreateInvoice = (newInfo) => ({
  type: c.GET_CREATE_INVOICE,
  newInfo
});

export const getInvoices = (invoices) => ({
  type: c.GET_INVOICES,
  invoices
});

export const getDataFailure = (error) => ({
  type: c.GET_DATA_FAILURE,
  error
});

export const getAddItemsInvoice = (newItemsData) => ({
  type: c.GET_ADD_ITEMS_INVOICE,
  newItemsData
});

export const getManageInvoice = () => ({
  type: c.GET_MANAGE_INVOICES
});

export const getSelectedInvoice = (id) => ({
  type: c.GET_SELECTED_INVOICE,
  id
});

export const getGoodsList = () => ({
  type: c.GET_GOODS_LIST
});

export const getGoods = (goods) => ({
  type: c.GET_GOODS,
  goods
});

export const getReset = () => ({
  type: c.GET_RESET
});

export const getEditInvoice = () => ({
  type: c.GET_EDIT_INVOICE
});

export const getUpdatedItems = (upInv) => ({
  type: c.GET_UPDATED_ITEMS,
  upInv
});

