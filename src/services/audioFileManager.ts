// Audio File Manager for Mindloop mindfulness app
// Handles audio file loading, caching, validation, and management

import { AmbientSound } from '../data/ambientSounds';
import { validateAudioUrl } from '../utils/audioUtils';

export interface AudioFileMetadata {
  duration: number;
  size: number;
  format: string;
  bitrate?: number;
  quality: 'low' | 'medium' | 'high';
  lastModified: number;
  isCached: boolean;
  cachePath?: string;
}

export interface AudioLoadOptions {
  preload?: boolean;
  quality?: 'low' | 'medium' | 'high';
  cacheStrategy?: 'memory' | 'disk' | 'none';
  timeout?: number;
}

export interface DownloadProgress {
  soundId: string;
  progress: number; // 0-100
  bytesDownloaded: number;
  totalBytes: number;
  status: 'downloading' | 'completed' | 'failed' | 'paused';
}

class AudioFileManager {
  private cache: Map<string, AudioFileMetadata> = new Map();
  private downloadQueue: Map<string, DownloadProgress> = new Map();
  private preloadQueue: string[] = [];
  private isPreloading: boolean = false;
  private maxCacheSize: number = 50 * 1024 * 1024; // 50MB
  private currentCacheSize: number = 0;

  /**
   * Validate and load an audio file
   */
  async loadAudioFile(
    soundId: string, 
    filePath: string, 
    options: AudioLoadOptions = {}
  ): Promise<AudioFileMetadata> {
    const {
      preload = false,
      quality = 'medium',
      cacheStrategy = 'disk',
      timeout = 10000
    } = options;

    try {
      // Check if already cached
      if (this.cache.has(soundId)) {
        const cached = this.cache.get(soundId)!;
        if (cached.isCached) {
          return cached;
        }
      }

      // Validate the file path/URL
      if (!this.validateFilePath(filePath)) {
        throw new Error(`Invalid audio file path: ${filePath}`);
      }

      // Load the audio file
      const metadata = await this.loadAudioFileInternal(filePath, timeout);
      
      // Apply quality adjustments if needed
      const adjustedMetadata = this.adjustQuality(metadata, quality);
      
      // Cache the file if requested
      if (cacheStrategy !== 'none') {
        await this.cacheAudioFile(soundId, filePath, adjustedMetadata, cacheStrategy);
      }

      // Store in memory cache
      this.cache.set(soundId, {
        ...adjustedMetadata,
        isCached: cacheStrategy !== 'none'
      });

      return {
        ...adjustedMetadata,
        isCached: cacheStrategy !== 'none'
      };
    } catch (error) {
      console.error(`Failed to load audio file ${soundId}:`, error);
      throw error;
    }
  }

  /**
   * Preload multiple audio files for better performance
   */
  async preloadAudioFiles(
    sounds: Array<{ id: string; filePath: string }>,
    options: AudioLoadOptions = {}
  ): Promise<void> {
    if (this.isPreloading) {
      // Add to queue if already preloading
      this.preloadQueue.push(...sounds.map(s => s.id));
      return;
    }

    this.isPreloading = true;
    
    try {
      const preloadPromises = sounds.map(async (sound) => {
        try {
          await this.loadAudioFile(sound.id, sound.filePath, { ...options, preload: true });
        } catch (error) {
          console.warn(`Failed to preload ${sound.id}:`, error);
          // Continue with other files even if one fails
        }
      });

      await Promise.allSettled(preloadPromises);
    } finally {
      this.isPreloading = false;
      
      // Process any queued preload requests
      if (this.preloadQueue.length > 0) {
        const queuedIds = this.preloadQueue.splice(0);
        const queuedSounds = queuedIds
          .map(id => ({ id, filePath: this.getFilePath(id) }))
          .filter((s): s is { id: string; filePath: string } => s.filePath !== null); // Filter out invalid IDs
        if (queuedSounds.length > 0) {
          await this.preloadAudioFiles(queuedSounds, options);
        }
      }
    }
  }

  /**
   * Download a remote audio file with progress tracking
   */
  async downloadAudioFile(
    soundId: string,
    url: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<string> {
    if (this.downloadQueue.has(soundId)) {
      throw new Error(`Download already in progress for ${soundId}`);
    }

    try {
      // Initialize download progress
      const progress: DownloadProgress = {
        soundId,
        progress: 0,
        bytesDownloaded: 0,
        totalBytes: 0,
        status: 'downloading'
      };
      
      this.downloadQueue.set(soundId, progress);
      onProgress?.(progress);

      // Simulate download with progress updates
      // In a real implementation, this would use react-native-fs or similar
      const localPath = await this.simulateDownload(url, (downloadProgress) => {
        progress.progress = downloadProgress.progress;
        progress.bytesDownloaded = downloadProgress.bytesDownloaded;
        progress.totalBytes = downloadProgress.totalBytes;
        this.downloadQueue.set(soundId, { ...progress });
        onProgress?.(progress);
      });

      // Mark as completed
      progress.status = 'completed';
      progress.progress = 100;
      this.downloadQueue.set(soundId, progress);
      onProgress?.(progress);

      return localPath;
    } catch (error) {
      // Mark as failed
      const progress = this.downloadQueue.get(soundId);
      if (progress) {
        progress.status = 'failed';
        this.downloadQueue.set(soundId, progress);
        onProgress?.(progress);
      }
      throw error;
    } finally {
      // Clean up download queue after completion
      setTimeout(() => {
        this.downloadQueue.delete(soundId);
      }, 5000);
    }
  }

  /**
   * Get download progress for a sound
   */
  getDownloadProgress(soundId: string): DownloadProgress | null {
    return this.downloadQueue.get(soundId) || null;
  }

  /**
   * Get cached metadata for a sound
   */
  getAudioMetadata(soundId: string): AudioFileMetadata | null {
    return this.cache.get(soundId) || null;
  }

  /**
   * Check if a sound is cached
   */
  isSoundCached(soundId: string): boolean {
    const metadata = this.cache.get(soundId);
    return metadata?.isCached || false;
  }

  /**
   * Clear audio cache
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
    this.currentCacheSize = 0;
    
    // In a real implementation, this would also clear disk cache
    // await this.clearDiskCache();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    count: number;
    sounds: string[];
  } {
    return {
      size: this.currentCacheSize,
      maxSize: this.maxCacheSize,
      count: this.cache.size,
      sounds: Array.from(this.cache.keys())
    };
  }

  /**
   * Validate file path or URL
   */
  private validateFilePath(filePath: string): boolean {
    if (!filePath || typeof filePath !== 'string') {
      return false;
    }

    // Check if it's a URL
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return validateAudioUrl(filePath);
    }

    // Check if it's a local file path with valid extension
    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
    return validExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }

  /**
   * Internal method to load audio file and extract metadata
   */
  private async loadAudioFileInternal(
    filePath: string, 
    timeout: number
  ): Promise<Omit<AudioFileMetadata, 'isCached' | 'cachePath'>> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout loading audio file: ${filePath}`));
      }, timeout);

      // Simulate audio file loading and metadata extraction
      // In a real implementation, this would use react-native-sound or similar
      setTimeout(() => {
        clearTimeout(timeoutId);
        
        // Simulate extracted metadata with realistic values
        const metadata: Omit<AudioFileMetadata, 'isCached' | 'cachePath'> = {
          duration: Math.floor(Math.random() * 1800) + 600, // 10-40 minutes
          size: Math.floor(Math.random() * 10485760) + 1048576, // 1-11 MB (realistic file sizes)
          format: filePath.split('.').pop()?.toLowerCase() || 'mp3',
          bitrate: 128,
          quality: 'medium',
          lastModified: Date.now()
        };

        resolve(metadata);
      }, Math.random() * 1000 + 500); // 500-1500ms delay
    });
  }

  /**
   * Adjust quality based on requested level
   */
  private adjustQuality(
    metadata: Omit<AudioFileMetadata, 'isCached' | 'cachePath'>,
    requestedQuality: 'low' | 'medium' | 'high'
  ): Omit<AudioFileMetadata, 'isCached' | 'cachePath'> {
    if (metadata.quality === requestedQuality) {
      return metadata;
    }

    // Simulate quality adjustment
    const qualityMultipliers = {
      low: 0.5,
      medium: 1.0,
      high: 1.5
    };

    const multiplier = qualityMultipliers[requestedQuality];
    
    return {
      ...metadata,
      quality: requestedQuality,
      size: Math.floor(metadata.size * multiplier),
      bitrate: Math.floor((metadata.bitrate || 128) * multiplier)
    };
  }

  /**
   * Cache audio file to disk or memory
   */
  private async cacheAudioFile(
    soundId: string,
    filePath: string,
    metadata: Omit<AudioFileMetadata, 'isCached' | 'cachePath'>,
    strategy: 'memory' | 'disk'
  ): Promise<void> {
    // Check cache size limits
    if (this.currentCacheSize + metadata.size > this.maxCacheSize) {
      await this.evictOldestCacheEntries(metadata.size);
    }

    // In a real implementation, this would:
    // - For disk: Copy file to cache directory
    // - For memory: Load file into memory buffer
    // For now, we'll just track the cache size
    
    this.currentCacheSize += metadata.size;
    
    // Update cache entry with cache path
    const cachePath = strategy === 'disk' 
      ? `cache://audio/${soundId}.${metadata.format}`
      : `memory://audio/${soundId}`;
    
    const existingEntry = this.cache.get(soundId);
    if (existingEntry) {
      this.cache.set(soundId, {
        ...existingEntry,
        ...metadata,
        cachePath
      });
    }
  }

  /**
   * Evict oldest cache entries to make space
   */
  private async evictOldestCacheEntries(requiredSpace: number): Promise<void> {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastModified - b.lastModified);

    let freedSpace = 0;
    for (const [soundId, metadata] of entries) {
      if (freedSpace >= requiredSpace) break;
      
      this.cache.delete(soundId);
      freedSpace += metadata.size;
      this.currentCacheSize -= metadata.size;
      
      // In a real implementation, this would also delete the actual cached file
    }
  }

  /**
   * Simulate file download with progress
   */
  private async simulateDownload(
    url: string,
    onProgress: (progress: { progress: number; bytesDownloaded: number; totalBytes: number }) => void
  ): Promise<string> {
    const totalBytes = Math.floor(Math.random() * 10) + 5; // 5-15 MB
    const chunkSize = Math.floor(totalBytes / 10);
    let downloaded = 0;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        downloaded += chunkSize;
        if (downloaded > totalBytes) downloaded = totalBytes;

        onProgress({
          progress: Math.floor((downloaded / totalBytes) * 100),
          bytesDownloaded: downloaded,
          totalBytes
        });

        if (downloaded >= totalBytes) {
          clearInterval(interval);
          resolve(`cache://downloads/${Date.now()}.mp3`);
        }
      }, 200);
    });
  }

  /**
   * Get file path for a sound ID (helper method)
   */
  private getFilePath(soundId: string): string | null {
    // This would typically look up the sound in the ambientSounds data
    // For now, return a placeholder
    return `audio/${soundId}.mp3`;
  }
}

// Export singleton instance
export const audioFileManager = new AudioFileManager();