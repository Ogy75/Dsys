import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Typography from './pages/Typography'
import Colors from './pages/Colors'
import Spacing from './pages/Spacing'
import Shadows from './pages/Shadows'
import BorderRadius from './pages/BorderRadius'
import ButtonPage from './pages/Button'
import InputPage from './pages/Input'
import SelectPage from './pages/Select'
import BadgePage from './pages/Badge'
import AlertPage from './pages/Alert'
import CardPage from './pages/Card'
import TabsPage from './pages/Tabs'
import ModalPage from './pages/Modal'
import DrawerPage from './pages/Drawer'
import SliderPage from './pages/Slider'
import TogglePage from './pages/Toggle'
import TagPage from './pages/Tag'
import AvatarPage from './pages/Avatar'
import DropdownPage from './pages/Dropdown'
import ToastPage from './pages/Toast'
import CheckboxPage from './pages/Checkbox'
import RadioPage from './pages/Radio'
import TooltipPage from './pages/Tooltip'
import PageLayoutPage from './pages/PageLayout'
import SpinnerPage from './pages/Spinner'
import ProgressPage from './pages/Progress'
import StepperPage from './pages/Stepper'
import TextareaPage from './pages/Textarea'
import IconButtonPage from './pages/IconButton'
import AccordionPage from './pages/Accordion'
import NavigationPage from './pages/Navigation'
import BreadcrumbPage from './pages/Breadcrumb'
import PaginationPage from './pages/Pagination'
import TablePage from './pages/Table'
import Placeholder from './pages/Placeholder'

function PlaceholderPage({ title }) {
  return <Placeholder title={title} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/typography" replace />} />

          {/* Foundations */}
          <Route path="/typography" element={<Typography />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/spacing" element={<Spacing />} />
          <Route path="/grid" element={<PlaceholderPage title="Grid" />} />
          <Route path="/shadows" element={<Shadows />} />
          <Route path="/border-radius" element={<BorderRadius />} />
          <Route path="/icons" element={<PlaceholderPage title="Icons" />} />

          {/* Components */}
          <Route path="/button" element={<ButtonPage />} />
          <Route path="/icon-button" element={<IconButtonPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/textarea" element={<TextareaPage />} />
          <Route path="/select" element={<SelectPage />} />
          <Route path="/checkbox" element={<CheckboxPage />} />
          <Route path="/radio" element={<RadioPage />} />
          <Route path="/toggle" element={<TogglePage />} />
          <Route path="/slider" element={<SliderPage />} />
          <Route path="/badge" element={<BadgePage />} />
          <Route path="/avatar" element={<AvatarPage />} />
          <Route path="/tag" element={<TagPage />} />
          <Route path="/chip" element={<PlaceholderPage title="Chip" />} />
          <Route path="/tooltip" element={<TooltipPage />} />
          <Route path="/popover" element={<PlaceholderPage title="Popover" />} />
          <Route path="/dropdown" element={<DropdownPage />} />
          <Route path="/modal" element={<ModalPage />} />
          <Route path="/drawer" element={<DrawerPage />} />
          <Route path="/alert" element={<AlertPage />} />
          <Route path="/toast" element={<ToastPage />} />
          <Route path="/banner" element={<PlaceholderPage title="Banner" />} />
          <Route path="/card" element={<CardPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/list" element={<PlaceholderPage title="List" />} />
          <Route path="/tabs" element={<TabsPage />} />
          <Route path="/accordion" element={<AccordionPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/breadcrumb" element={<BreadcrumbPage />} />
          <Route path="/pagination" element={<PaginationPage />} />
          <Route path="/stepper" element={<StepperPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/spinner" element={<SpinnerPage />} />
          <Route path="/skeleton" element={<PlaceholderPage title="Skeleton" />} />
          <Route path="/divider" element={<PlaceholderPage title="Divider" />} />

          {/* Layouts */}
          <Route path="/container" element={<PlaceholderPage title="Container" />} />
          <Route path="/flexbox" element={<PlaceholderPage title="Flexbox" />} />
          <Route path="/grid-layout" element={<PlaceholderPage title="Grid Layout" />} />
          <Route path="/stack" element={<PlaceholderPage title="Stack" />} />
          <Route path="/sidebar-layout" element={<PlaceholderPage title="Sidebar Layout" />} />
          <Route path="/split-layout" element={<PlaceholderPage title="Split Layout" />} />

          {/* Patterns */}
          <Route path="/page-layout" element={<PageLayoutPage />} />
          <Route path="/form-pattern" element={<PlaceholderPage title="Form Pattern" />} />
          <Route path="/login" element={<PlaceholderPage title="Login" />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/data-table" element={<PlaceholderPage title="Data Table" />} />
          <Route path="/empty-state" element={<PlaceholderPage title="Empty State" />} />
          <Route path="/error-state" element={<PlaceholderPage title="Error State" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
