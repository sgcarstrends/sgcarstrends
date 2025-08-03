import { Card, CardContent, CardHeader, CardTitle } from "@admin/components/ui/card"
import { Badge } from "@admin/components/ui/badge"
import { Button } from "@admin/components/ui/button"
import { Activity, Database, Server, RefreshCw } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">
                Operational
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All systems running normally
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Response time: 120ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">
                Connected
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              PostgreSQL connection active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">
              Data last updated
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <RefreshCw className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Trigger Data Update</div>
                  <div className="text-xs text-muted-foreground">Update car registration data</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Database className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Manage Data</div>
                  <div className="text-xs text-muted-foreground">View and edit data records</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Activity className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">View Workflows</div>
                  <div className="text-xs text-muted-foreground">Monitor automated processes</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Server className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">System Logs</div>
                  <div className="text-xs text-muted-foreground">View application logs</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Data update completed</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Workflow executed</div>
                  <div className="text-xs text-muted-foreground">4 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">System maintenance</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
