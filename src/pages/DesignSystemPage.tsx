import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Alert, 
  Badge, 
  Modal, 
  Tabs, 
  Toast, 
  MemoryCard, 
  FamilyMemberCard, 
  TagInput, 
  ActivityFeedItem, 
  GameQuestionCard, 
  ScreenReaderOnly, 
  Container, 
  Grid, 
  Skeleton, 
  Breadcrumbs, 
  Pagination 
} from '../design-system';
import { 
  Home, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  User, 
  Settings, 
  Bell, 
  Calendar, 
  Heart, 
  Search, 
  Camera, 
  Video, 
  FileText, 
  Volume2 
} from 'lucide-react';

export function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [tags, setTags] = useState<string[]>(['Family', 'Vacation']);
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <Container size="xl" className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">MemoryMesh Design System</h1>
      
      {/* Color System */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Color System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Primary Colors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Palette (Sage Garden)</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-sage-50 rounded-l-md"></div>
                <div className="w-12 h-12 bg-sage-100"></div>
                <div className="w-12 h-12 bg-sage-200"></div>
                <div className="w-12 h-12 bg-sage-300"></div>
                <div className="w-12 h-12 bg-sage-400"></div>
                <div className="w-12 h-12 bg-sage-500"></div>
                <div className="w-12 h-12 bg-sage-600"></div>
                <div className="w-12 h-12 bg-sage-700"></div>
                <div className="w-12 h-12 bg-sage-800"></div>
                <div className="w-12 h-12 bg-sage-900 rounded-r-md"></div>
              </div>
              <div className="flex text-xs text-gray-600">
                <div className="w-12 text-center">50</div>
                <div className="w-12 text-center">100</div>
                <div className="w-12 text-center">200</div>
                <div className="w-12 text-center">300</div>
                <div className="w-12 text-center">400</div>
                <div className="w-12 text-center">500</div>
                <div className="w-12 text-center">600</div>
                <div className="w-12 text-center">700</div>
                <div className="w-12 text-center">800</div>
                <div className="w-12 text-center">900</div>
              </div>
            </div>
          </div>
          
          {/* Semantic Colors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Semantic Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-24 py-2 bg-blue-600 text-white text-center text-sm rounded-l-md">Info</div>
                <div className="w-24 py-2 bg-green-600 text-white text-center text-sm">Success</div>
                <div className="w-24 py-2 bg-yellow-500 text-white text-center text-sm">Warning</div>
                <div className="w-24 py-2 bg-red-600 text-white text-center text-sm rounded-r-md">Error</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Typography</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Headings</h3>
            <div className="space-y-4">
              <div>
                <h1 className="text-5xl font-bold">Heading 1 (5xl)</h1>
                <p className="text-sm text-gray-500">Used for main page titles</p>
              </div>
              <div>
                <h2 className="text-4xl font-bold">Heading 2 (4xl)</h2>
                <p className="text-sm text-gray-500">Used for section titles</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">Heading 3 (3xl)</h3>
                <p className="text-sm text-gray-500">Used for subsection titles</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">Heading 4 (2xl)</h4>
                <p className="text-sm text-gray-500">Used for card titles</p>
              </div>
              <div>
                <h5 className="text-xl font-bold">Heading 5 (xl)</h5>
                <p className="text-sm text-gray-500">Used for smaller section titles</p>
              </div>
              <div>
                <h6 className="text-lg font-bold">Heading 6 (lg)</h6>
                <p className="text-sm text-gray-500">Used for the smallest section titles</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Body Text</h3>
            <div className="space-y-4">
              <div>
                <p className="text-base">Base text (16px) - This is the standard body text used throughout the application.</p>
              </div>
              <div>
                <p className="text-sm">Small text (14px) - Used for secondary information and UI elements.</p>
              </div>
              <div>
                <p className="text-xs">Extra small text (12px) - Used for captions, labels, and helper text.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Font Weights</h3>
            <div className="space-y-2">
              <p className="font-light">Light (300) - Used sparingly for large text</p>
              <p className="font-normal">Regular (400) - Default body text weight</p>
              <p className="font-medium">Medium (500) - Used for emphasis and UI elements</p>
              <p className="font-semibold">Semibold (600) - Used for subheadings and important UI elements</p>
              <p className="font-bold">Bold (700) - Used for headings and strong emphasis</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Spacing */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Spacing System</h2>
        <p className="mb-4">Based on an 8px grid system with consistent spacing tokens.</p>
        
        <div className="flex flex-wrap gap-4">
          {[2, 4, 6, 8, 12, 16, 24, 32].map((size) => (
            <div key={size} className="flex flex-col items-center">
              <div className={`bg-sage-200 w-${size} h-${size}`}></div>
              <span className="text-xs text-gray-500 mt-1">{size}px</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Components</h2>
        
        {/* Buttons */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="tertiary">Tertiary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="xs">Extra Small</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Extra Large</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" leftIcon={<Heart size={16} />}>With Left Icon</Button>
              <Button variant="primary" rightIcon={<ArrowRight size={16} />}>With Right Icon</Button>
              <Button variant="primary" isLoading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </div>
          </div>
        </div>
        
        {/* Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default">
              <h4 className="text-lg font-semibold mb-2">Default Card</h4>
              <p className="text-gray-600">This is a default card component.</p>
            </Card>
            
            <Card 
              variant="elevated"
              header={<h4 className="font-semibold">Card with Header</h4>}
              footer={<div className="text-right"><Button variant="primary" size="sm">Action</Button></div>}
            >
              <p className="text-gray-600">This card has a header and footer.</p>
            </Card>
            
            <Card 
              variant="interactive"
              onClick={() => alert('Card clicked')}
            >
              <h4 className="text-lg font-semibold mb-2">Interactive Card</h4>
              <p className="text-gray-600">Click me to trigger an action.</p>
            </Card>
          </div>
        </div>
        
        {/* Form Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Form Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input 
                label="Text Input" 
                placeholder="Enter text here" 
                helperText="This is a helper text"
              />
              
              <Input 
                label="Input with Icon" 
                placeholder="Search..." 
                leftIcon={<Search size={16} className="text-gray-400" />}
              />
              
              <Input 
                label="Error Input" 
                placeholder="Enter text here" 
                error="This field is required"
              />
              
              <Select 
                label="Select Input"
                options={[
                  { value: '', label: 'Select an option', disabled: true },
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ]}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Checkboxes</label>
                <div className="space-y-2">
                  <Checkbox label="Option 1" />
                  <Checkbox label="Option 2" />
                  <Checkbox label="Disabled option" disabled />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Radio Buttons</label>
                <div className="space-y-2">
                  <Radio name="radio-group" label="Option 1" />
                  <Radio name="radio-group" label="Option 2" />
                  <Radio name="radio-group" label="Disabled option" disabled />
                </div>
              </div>
              
              <TagInput
                label="Tag Input"
                tags={tags}
                onChange={setTags}
                suggestions={['Family', 'Vacation', 'Beach', 'Summer', 'Holiday', 'Birthday']}
              />
            </div>
          </div>
        </div>
        
        {/* Feedback Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Feedback Components</h3>
          <div className="space-y-4">
            <Alert 
              variant="info" 
              title="Information" 
              icon={<Info size={20} />}
            >
              This is an informational alert.
            </Alert>
            
            <Alert 
              variant="success" 
              title="Success" 
              icon={<CheckCircle size={20} />}
            >
              Your changes have been saved successfully.
            </Alert>
            
            <Alert 
              variant="warning" 
              title="Warning" 
              icon={<AlertTriangle size={20} />}
            >
              Please review your information before continuing.
            </Alert>
            
            <Alert 
              variant="error" 
              title="Error" 
              icon={<X size={20} />}
              dismissible
              onDismiss={() => console.log('Alert dismissed')}
            >
              There was an error processing your request.
            </Alert>
            
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Button onClick={() => setIsToastVisible(true)}>Show Toast</Button>
            </div>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Modal Title"
            >
              <div className="mb-6">
                <p className="text-gray-600">This is a modal dialog. It can contain any content.</p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="tertiary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm</Button>
              </div>
            </Modal>
            
            {isToastVisible && (
              <Toast
                variant="success"
                title="Success"
                icon={<CheckCircle size={20} />}
                onDismiss={() => setIsToastVisible(false)}
                duration={3000}
              >
                Your changes have been saved successfully.
              </Toast>
            )}
          </div>
        </div>
        
        {/* Navigation Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Navigation Components</h3>
          <div className="space-y-6">
            <Tabs
              tabs={[
                {
                  id: 'tab1',
                  label: 'Tab 1',
                  content: <div className="p-4 bg-gray-50 rounded-lg">Content for Tab 1</div>,
                  icon: <Home size={16} />
                },
                {
                  id: 'tab2',
                  label: 'Tab 2',
                  content: <div className="p-4 bg-gray-50 rounded-lg">Content for Tab 2</div>,
                  icon: <Settings size={16} />
                },
                {
                  id: 'tab3',
                  label: 'Tab 3',
                  content: <div className="p-4 bg-gray-50 rounded-lg">Content for Tab 3</div>,
                  icon: <Bell size={16} />,
                  badge: <Badge variant="primary" size="sm" rounded>New</Badge>
                },
              ]}
            />
            
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/', icon: <Home size={16} /> },
                { label: 'Memories', href: '/memories' },
                { label: 'Family Vacation 2024', isCurrent: true },
              ]}
            />
            
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        
        {/* Memory-Specific Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Memory-Specific Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MemoryCard
              title="Family Vacation 2024"
              description="Our amazing trip to Hawaii last summer"
              type="photo"
              thumbnail="https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400"
              date="2024-07-15"
              author={{ name: "Mom", relationship: "Mother" }}
              tags={["Vacation", "Beach", "Summer", "Family"]}
              interactions={{ likes: 24, comments: 8, views: 156 }}
              isLiked={true}
              onClick={() => alert('Memory card clicked')}
              onLike={() => alert('Like clicked')}
              onComment={() => alert('Comment clicked')}
              onShare={() => alert('Share clicked')}
            />
            
            <div className="space-y-4">
              <FamilyMemberCard
                name="Sarah Johnson"
                relationship="Mother"
                role="admin"
                isCurrentUser={false}
                actions={
                  <Button variant="ghost" size="sm">
                    <Settings size={16} />
                  </Button>
                }
              />
              
              <ActivityFeedItem
                type="upload"
                actor={{ name: "Mom", relationship: "Mother" }}
                content="uploaded 3 new photos from Christmas"
                timestamp={new Date(Date.now() - 1000 * 60 * 30).toISOString()}
                memory={{ title: "Christmas Morning 2024", thumbnail: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400" }}
                isNew={true}
                isHighlighted={true}
              />
            </div>
          </div>
        </div>
        
        {/* Game Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Game Components</h3>
          <GameQuestionCard
            question="Who is this person?"
            imageUrl="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400"
            options={["Grandma Mary", "Aunt Sarah", "Mom", "Cousin Emma"]}
            selectedAnswer={2}
            correctAnswer={2}
            showAnswer={true}
            timeRemaining={45}
            hint="This person is your mother"
            showHint={true}
          />
        </div>
        
        {/* Accessibility Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessibility Components</h3>
          <div className="space-y-4">
            <div>
              <p>This text is visible to everyone.</p>
              <ScreenReaderOnly>This text is only visible to screen readers.</ScreenReaderOnly>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="primary">
                <ScreenReaderOnly>Download</ScreenReaderOnly>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </Button>
              <span className="text-sm text-gray-600">This button has text that's only visible to screen readers</span>
            </div>
            
            <div>
              <p className="mb-2">Focus indicators are visible when tabbing through interactive elements:</p>
              <div className="flex space-x-2">
                <Button variant="primary">Tab to me</Button>
                <Button variant="secondary">Then to me</Button>
                <Button variant="tertiary">And then to me</Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Layout Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Layout Components</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Grid System</h4>
              <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="bg-sage-100 p-4 rounded-lg text-center">
                    Grid Item {item}
                  </div>
                ))}
              </Grid>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Skeletons</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="90%" />
                </div>
                
                <div className="space-y-4">
                  <Skeleton variant="avatar" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="50%" />
                </div>
                
                <Skeleton variant="card" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}